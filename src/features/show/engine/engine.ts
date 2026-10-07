import * as THREE from 'three';
import { markOutlineCentered, markWidth, pointInPolygon } from './shapes';
import { BADGE, BADGE_AT, END, OBJECTS, RAIL, STATIONS, deg, type CamState, type FxState, type ObjSpec, type ObjState, type Vec3 } from './world';

const FOV = 32;
const MARK_H = 430;

/** pixels da logo do Recanto: as partículas do fecho nascem deles, cor por cor */
export interface BadgePixels {
  data: Uint8ClampedArray;
  w: number;
  h: number;
}

export interface EngineOptions {
  canvas: HTMLCanvasElement;
  persp: HTMLElement;
  camEl: HTMLElement;
  /** sem animação ociosa nem paralaxe (prefers-reduced-motion) */
  calm: boolean;
  low: boolean;
  badge: BadgePixels | null;
}

interface Runtime {
  spec: ObjSpec;
  el: HTMLElement;
  res: number;
  visible: boolean;
  lastT: string;
  lastO: number;
  lastB: number;
}

/** PRNG determinístico: a mesma constelação em todo carregamento. */
function mulberry(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const eps = (v: number) => (Math.abs(v) < 1e-6 ? 0 : +v.toFixed(5));

function cameraCss(m: THREE.Matrix4) {
  const e = m.elements;
  return `matrix3d(${eps(e[0])},${eps(-e[1])},${eps(e[2])},${eps(e[3])},${eps(e[4])},${eps(-e[5])},${eps(e[6])},${eps(e[7])},${eps(e[8])},${eps(-e[9])},${eps(e[10])},${eps(e[11])},${eps(e[12])},${eps(-e[13])},${eps(e[14])},${eps(e[15])})`;
}

function objectCss(m: THREE.Matrix4) {
  const e = m.elements;
  return `translate(-50%,-50%) matrix3d(${eps(e[0])},${eps(e[1])},${eps(e[2])},${eps(e[3])},${eps(-e[4])},${eps(-e[5])},${eps(-e[6])},${eps(-e[7])},${eps(e[8])},${eps(e[9])},${eps(e[10])},${eps(e[11])},${eps(e[12])},${eps(e[13])},${eps(e[14])},${eps(e[15])})`;
}

/** o trilho é parametrizado pelos pontos de controle, não pelo comprimento: a estação k cai sempre em k/(n-1) */
class RailCurve extends THREE.CatmullRomCurve3 {
  getPointAt(u: number, target?: THREE.Vector3) {
    return this.getPoint(u, target);
  }
  getTangentAt(u: number, target?: THREE.Vector3) {
    return this.getTangent(u, target);
  }
}

export function createEngine(opts: EngineOptions) {
  const { canvas, persp, camEl, calm, low, badge } = opts;
  const rand = mulberry(19950307);

  // ---------- estado animável (o GSAP escreve aqui; o motor só lê) ----------
  const cam: CamState = { cx: 0, cy: 0, cz: 0, w: 1700, h: 1000, yaw: 0, pitch: 0, roll: 0, ox: 0, oy: 0 };
  const fx: FxState = {
    form: 0,
    turb: 0,
    reveal: 0,
    pAlpha: 1,
    bokeh: 1,
    tint: 0,
    mark: 0,
    markYaw: 0,
    markPitch: 0,
    markScale: 1,
    glow: 0,
    glowX: 0,
    glowY: 0,
    grid: 0,
    rail: 0,
    signal: 0,
  };
  const objs: Record<string, ObjState> = {};
  const runtime: Runtime[] = [];

  for (const spec of OBJECTS) {
    const el = camEl.querySelector<HTMLElement>(`[data-obj="${spec.id}"]`);
    if (!el) continue;
    const inner = el.firstElementChild as HTMLElement;
    const res = low ? Math.min(spec.res ?? 1, 1.15) : (spec.res ?? 1);
    const w = inner.offsetWidth;
    const h = inner.offsetHeight;
    inner.style.width = `${w}px`;
    inner.style.height = `${h}px`;
    inner.style.transform = `scale(${res})`;
    el.style.width = `${w * res}px`;
    el.style.height = `${h * res}px`;
    el.dataset.w = String(w);
    el.dataset.h = String(h);
    objs[spec.id] = {
      x: spec.pos[0],
      y: spec.pos[1],
      z: spec.pos[2],
      rx: spec.rot?.[0] ?? 0,
      ry: spec.rot?.[1] ?? 0,
      rz: spec.rot?.[2] ?? 0,
      s: spec.scale ?? 1,
      o: 0,
    };
    el.style.visibility = 'hidden';
    runtime.push({ spec, el, res, visible: false, lastT: '', lastO: -1, lastB: -1 });
  }

  // ---------- three ----------
  let renderer: THREE.WebGLRenderer | null = null;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: !low, alpha: true, powerPreference: 'high-performance' });
  } catch {
    renderer = null;
  }
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 20, 60000);
  const disposables: Array<{ dispose(): void }> = [];

  let pUniforms: Record<string, THREE.IUniform> | null = null;
  let mark: THREE.Group | null = null;
  let markMats: THREE.MeshPhysicalMaterial[] = [];
  let glow: THREE.Mesh | null = null;
  let glowMat: THREE.ShaderMaterial | null = null;
  let gridMat: THREE.ShaderMaterial | null = null;
  let railMat: THREE.ShaderMaterial | null = null;
  const forms: Float32Array[] = [];
  let aA: THREE.BufferAttribute | null = null;
  let aB: THREE.BufferAttribute | null = null;
  let seg = -1;

  if (renderer) {
    renderer.setClearColor(0x000000, 0);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    // ---- partículas -------------------------------------------------------
    const N = low ? 6000 : 20000;
    const poly = markOutlineCentered(MARK_H);
    const markW = markWidth(MARK_H);
    const rail = new RailCurve(
      RAIL.map((p) => new THREE.Vector3(...p)),
      false,
      'catmullrom',
      0.5,
    );

    const scatter = new Float32Array(N * 3);
    const markF = new Float32Array(N * 3);
    const pathF = new Float32Array(N * 3);
    const dust = new Float32Array(N * 3);
    const badgeF = new Float32Array(N * 3);
    const col = new Float32Array(N * 3);
    const rnd = new Float32Array(N * 4);

    const gauss = () => {
      let u = 0;
      let v = 0;
      while (u === 0) u = rand();
      while (v === 0) v = rand();
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
    };

    // a logo vem sobre branco: só os pixels com tinta viram partícula
    const solid: number[] = [];
    if (badge) {
      const d = badge.data;
      for (let i = 0; i < badge.w * badge.h; i++) {
        if (d[i * 4 + 3] > 150 && !(d[i * 4] > 236 && d[i * 4 + 1] > 236 && d[i * 4 + 2] > 236)) solid.push(i);
      }
    }
    const kBadge = badge ? BADGE.h / badge.h : 1;
    const tmp = new THREE.Vector3();
    const lastStation = STATIONS[STATIONS.length - 1].pos;
    const span = END[0] + 2600;

    for (let i = 0; i < N; i++) {
      const i3 = i * 3;
      // dispersão inicial: o primeiro ponto é "o sinal", exatamente no centro
      if (i === 0) {
        scatter[0] = scatter[1] = scatter[2] = 0;
      } else {
        const r = 260 + Math.pow(rand(), 0.6) * 2400;
        const th = rand() * Math.PI * 2;
        scatter[i3] = Math.cos(th) * r * 1.25;
        scatter[i3 + 1] = Math.sin(th) * r * 0.7;
        scatter[i3 + 2] = -1900 + rand() * 2500;
      }

      // o "feito": 76% dentro do contorno, o resto vira halo
      if (rand() < 0.76) {
        let x = 0;
        let y = 0;
        for (let k = 0; k < 40; k++) {
          x = (rand() - 0.5) * markW;
          y = (rand() - 0.5) * MARK_H;
          if (pointInPolygon(x, y, poly)) break;
        }
        markF[i3] = x;
        markF[i3 + 1] = y;
        markF[i3 + 2] = (rand() - 0.5) * 46;
      } else {
        const r = 420 + rand() * 1500;
        const th = rand() * Math.PI * 2;
        markF[i3] = Math.cos(th) * r * 1.3;
        markF[i3 + 1] = Math.sin(th) * r * 0.72;
        markF[i3 + 2] = -1500 + rand() * 1500;
      }

      // o caminho: nuvem em cada estação, um fio de luz no trilho e poeira em volta
      const pick = rand();
      if (pick < 0.5) {
        const c = STATIONS[Math.floor(rand() * STATIONS.length)].pos;
        const spread = 190 + rand() * 230;
        pathF[i3] = c[0] + gauss() * spread;
        pathF[i3 + 1] = c[1] + gauss() * spread * 0.8;
        pathF[i3 + 2] = c[2] - 120 + gauss() * spread;
      } else if (pick < 0.78) {
        rail.getPoint(rand(), tmp);
        pathF[i3] = tmp.x + gauss() * 70;
        pathF[i3 + 1] = tmp.y + gauss() * 46;
        pathF[i3 + 2] = tmp.z + gauss() * 70;
      } else {
        pathF[i3] = -1200 + rand() * (lastStation[0] + 3600);
        pathF[i3 + 1] = (rand() - 0.5) * 3600;
        pathF[i3 + 2] = -2600 + rand() * 3000;
      }

      // poeira calma atrás (e um pouco à frente) das estações, ao longo do mundo inteiro
      const front = rand() < 0.05;
      const px = -2600 + rand() * (span + 2600);
      dust[i3] = px;
      dust[i3 + 1] = (px / span) * 900 - 300 + (rand() - 0.5) * 3400;
      dust[i3 + 2] = front ? 500 + rand() * 1000 : -3200 + rand() * 2700;

      // logo do Recanto: 82% em cima de um pixel com tinta (com a cor dele), o resto vira halo
      let r = 0.36;
      let g = 0.78;
      let b = 1.0;
      if (solid.length && rand() < 0.82) {
        const p = solid[Math.floor(rand() * solid.length)];
        const bx = p % badge!.w;
        const by = Math.floor(p / badge!.w);
        badgeF[i3] = BADGE_AT[0] + (bx - badge!.w / 2 + rand() - 0.5) * kBadge;
        badgeF[i3 + 1] = BADGE_AT[1] + (badge!.h / 2 - by + rand() - 0.5) * kBadge;
        badgeF[i3 + 2] = BADGE_AT[2] + (rand() - 0.5) * 34;
        r = badge!.data[p * 4] / 255;
        g = badge!.data[p * 4 + 1] / 255;
        b = badge!.data[p * 4 + 2] / 255;
        // tinta escura some no azul-noite: sobe o brilho sem mudar o matiz
        const lift = Math.min(2.2, 0.92 / Math.max(r, g, b, 0.05));
        if (lift > 1) {
          r *= lift;
          g *= lift;
          b *= lift;
        }
      } else {
        const rr = 520 + rand() * 1700;
        const th = rand() * Math.PI * 2;
        badgeF[i3] = BADGE_AT[0] + Math.cos(th) * rr * 1.3;
        badgeF[i3 + 1] = BADGE_AT[1] + Math.sin(th) * rr * 0.72;
        badgeF[i3 + 2] = BADGE_AT[2] - 1500 + rand() * 1500;
      }
      col[i3] = r;
      col[i3 + 1] = g;
      col[i3 + 2] = b;

      rnd[i * 4] = i === 0 ? 0 : rand();
      rnd[i * 4 + 1] = rand();
      rnd[i * 4 + 2] = rand();
      rnd[i * 4 + 3] = rand();
    }
    forms.push(scatter, markF, pathF, dust, badgeF);

    const geo = new THREE.BufferGeometry();
    aA = new THREE.BufferAttribute(new Float32Array(scatter), 3);
    aB = new THREE.BufferAttribute(new Float32Array(markF), 3);
    aA.setUsage(THREE.DynamicDrawUsage);
    aB.setUsage(THREE.DynamicDrawUsage);
    geo.setAttribute('position', aA);
    geo.setAttribute('aB', aB);
    geo.setAttribute('aRnd', new THREE.BufferAttribute(rnd, 4));
    geo.setAttribute('aCol', new THREE.BufferAttribute(col, 3));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 1e6);

    pUniforms = {
      uT: { value: 0 },
      uMix: { value: 0 },
      uTurb: { value: 0 },
      uReveal: { value: 0 },
      uAlpha: { value: 1 },
      uBokeh: { value: 1 },
      uTint: { value: 0 },
      uFocus: { value: 2000 },
      uScale: { value: 1500 },
      uDpr: { value: 1 },
      uPulse: { value: 0 },
      uSignal: { value: 0 },
    };
    const pMat = new THREE.ShaderMaterial({
      uniforms: pUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: /* glsl */ `
        attribute vec3 aB;
        attribute vec4 aRnd;
        attribute vec3 aCol;
        uniform float uT, uMix, uTurb, uReveal, uAlpha, uBokeh, uTint, uFocus, uScale, uDpr, uPulse, uSignal;
        varying float vAlpha;
        varying float vTone;
        varying float vAcc;
        varying vec3 vCol;
        void main() {
          float first = step(aRnd.x, 0.00001);
          float t = clamp((uMix - aRnd.w * 0.38) / 0.62, 0.0, 1.0);
          t = t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
          vec3 p = mix(position, aB, t);
          float k = sin(t * 3.14159265);
          float a = k * (aRnd.x - 0.5) * 1.6;
          float c = cos(a), s = sin(a);
          p.xy = mat2(c, -s, s, c) * (p.xy - mix(position.xy, aB.xy, 0.5)) + mix(position.xy, aB.xy, 0.5);
          vec3 n = vec3(
            sin(aRnd.y * 6.283 + uT * 0.55 + p.y * 0.0031),
            cos(aRnd.x * 6.283 + uT * 0.47 + p.x * 0.0027),
            sin(aRnd.z * 6.283 + uT * 0.39));
          p += n * (5.0 * (1.0 - uTint * 0.75) + uTurb * k * 240.0);
          vec4 mv = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mv;
          float d = max(-mv.z, 1.0);
          float coc = abs(d - uFocus) / max(uFocus, 1.0);
          float size = (5.0 + aRnd.z * aRnd.z * 13.0) * uScale / d;
          size *= 1.0 - uTint * 0.42;
          size *= 1.0 + coc * 2.6 * uBokeh;
          size *= 1.0 + first * uSignal * (2.4 + uPulse * 2.2);
          gl_PointSize = min(size * uDpr, 96.0 * uDpr);
          float tw = 0.62 + 0.38 * sin(uT * (0.6 + aRnd.y * 1.7) + aRnd.z * 40.0);
          tw = mix(tw, 0.9, uTint);
          float vis = mix(step(aRnd.x, uReveal), max(uSignal, step(0.0005, uReveal)), first);
          vAlpha = vis * uAlpha * tw * 1.25 / (1.0 + coc * coc * 2.2 * uBokeh);
          vAlpha *= 1.0 - smoothstep(9000.0, 52000.0, d);
          vAlpha = mix(vAlpha, max(vAlpha, 0.8 + 0.2 * uPulse), first * uSignal);
          vTone = aRnd.y;
          vAcc = aRnd.w;
          vCol = aCol;
        }`,
      fragmentShader: /* glsl */ `
        uniform float uTint;
        varying float vAlpha;
        varying float vTone;
        varying float vAcc;
        varying vec3 vCol;
        void main() {
          float r = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, r);
          a = a * a * (0.55 + 0.45 * smoothstep(0.22, 0.0, r));
          // azul do Recanto, com uma pitada do amarelo e do vermelho da marca
          vec3 col = mix(vec3(0.0, 0.56, 0.96), vec3(0.62, 0.86, 1.0), smoothstep(0.35, 1.0, vTone));
          col = mix(col, vec3(1.0, 0.86, 0.1), step(0.945, vAcc));
          col = mix(col, vec3(1.0, 0.22, 0.2), step(vAcc, 0.035));
          col = mix(col, vec3(1.0), smoothstep(0.18, 0.0, r) * 0.5);
          col = mix(col, vCol * 0.92 + 0.04, uTint);
          gl_FragColor = vec4(col * a * vAlpha, a * vAlpha);
        }`,
    });
    const points = new THREE.Points(geo, pMat);
    points.renderOrder = 3;
    points.frustumCulled = false;
    scene.add(points);
    disposables.push(geo, pMat);

    // ---- ambiente para reflexos (estúdio procedural, sem HDR externo) -----
    const envScene = new THREE.Scene();
    const strip = (w: number, h: number, color: THREE.Color, pos: Vec3, look: Vec3 = [0, 0, 0]) => {
      const g = new THREE.PlaneGeometry(w, h);
      const m = new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(g, m);
      mesh.position.set(...pos);
      mesh.lookAt(...look);
      envScene.add(mesh);
      disposables.push(g, m);
    };
    envScene.background = new THREE.Color(0x03101f);
    const domeGeo = new THREE.SphereGeometry(40, 32, 16);
    const domeMat = new THREE.ShaderMaterial({
      side: THREE.BackSide,
      vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: /* glsl */ `
        varying vec3 vP;
        void main(){
          float up = vP.y * 0.5 + 0.5;
          vec3 low = vec3(0.01, 0.04, 0.09);
          vec3 mid = vec3(0.04, 0.3, 0.62);
          vec3 top = vec3(1.5, 1.9, 2.2);
          vec3 c = mix(low, mid, smoothstep(0.0, 0.55, up));
          c = mix(c, top, smoothstep(0.55, 1.0, up));
          c += vec3(0.6, 1.6, 2.6) * pow(max(dot(vP, normalize(vec3(-0.75, 0.25, 0.6))), 0.0), 6.0);
          c += vec3(2.2, 1.7, 0.4) * pow(max(dot(vP, normalize(vec3(0.85, -0.1, 0.5))), 0.0), 12.0);
          gl_FragColor = vec4(c, 1.0);
        }`,
    });
    envScene.add(new THREE.Mesh(domeGeo, domeMat));
    disposables.push(domeGeo, domeMat);
    strip(14, 5, new THREE.Color(7, 7.6, 8.5), [0, 9, 3]);
    strip(3, 12, new THREE.Color(1.4, 4.6, 9), [-10, 1, 2]);
    strip(2.2, 10, new THREE.Color(5, 6.4, 9), [10, 2, -2]);
    strip(8, 1.2, new THREE.Color(0.8, 2.8, 6), [0, -8, 4]);
    strip(5, 5, new THREE.Color(1.0, 1.6, 2.4), [0, 0, 12]);
    const pmrem = new THREE.PMREMGenerator(renderer);
    const env = pmrem.fromScene(envScene, 0.035);
    scene.environment = env.texture;
    disposables.push(env, pmrem);

    // ---- o "feito" extrudado ----------------------------------------------
    const shape = new THREE.Shape();
    poly.forEach(([x, y], i) => (i ? shape.lineTo(x, y) : shape.moveTo(x, y)));
    shape.closePath();
    const lgeo = new THREE.ExtrudeGeometry(shape, {
      depth: 96,
      bevelEnabled: true,
      bevelThickness: 12,
      bevelSize: 10,
      bevelOffset: -10,
      bevelSegments: low ? 3 : 7,
      curveSegments: 12,
    });
    lgeo.translate(0, 0, -48);
    const face = new THREE.MeshPhysicalMaterial({
      color: 0x0090dc,
      metalness: 0.5,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      envMapIntensity: 0.75,
      emissive: 0x005fb4,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0,
    });
    const side = new THREE.MeshPhysicalMaterial({
      color: 0x5cc8ff,
      metalness: 0.6,
      roughness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.25,
      emissive: 0x0a9be0,
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: 0,
    });
    markMats = [face, side];
    mark = new THREE.Group();
    mark.add(new THREE.Mesh(lgeo, markMats));
    mark.renderOrder = 1;
    mark.visible = false;
    scene.add(mark);
    disposables.push(lgeo, face, side);

    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(-700, 900, 1300);
    const rim = new THREE.DirectionalLight(0x9ddcff, 1.6);
    rim.position.set(900, -200, -700);
    scene.add(key, rim, new THREE.AmbientLight(0x2aa8ff, 0.35));

    // ---- halo ---------------------------------------------------------------
    const ggeo = new THREE.PlaneGeometry(1, 1);
    glowMat = new THREE.ShaderMaterial({
      uniforms: { uA: { value: 0 } },
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: /* glsl */ `
        uniform float uA; varying vec2 vUv;
        void main(){
          float r = length(vUv - 0.5) * 2.0;
          float a = pow(max(1.0 - r, 0.0), 2.6);
          gl_FragColor = vec4(vec3(0.0, 0.46, 0.92) * a * uA, a * uA);
        }`,
    });
    glow = new THREE.Mesh(ggeo, glowMat);
    glow.scale.set(2500, 1900, 1);
    glow.position.set(0, 0, -260);
    glow.renderOrder = 0;
    scene.add(glow);
    disposables.push(ggeo, glowMat);

    // ---- piso em grade ------------------------------------------------------
    const fgeo = new THREE.PlaneGeometry(1, 1);
    gridMat = new THREE.ShaderMaterial({
      uniforms: { uA: { value: 0 }, uC: { value: new THREE.Vector3() } },
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: /* glsl */ `
        uniform float uA; uniform vec3 uC; varying vec3 vW;
        float gridLine(vec2 p, float cell){
          vec2 g = abs(fract(p / cell - 0.5) - 0.5) / fwidth(p / cell);
          return 1.0 - min(min(g.x, g.y), 1.0);
        }
        void main(){
          float l = gridLine(vW.xz, 176.0) * 0.9 + gridLine(vW.xz, 880.0) * 0.6;
          float d = length(vW.xz - uC.xz);
          float fade = smoothstep(6200.0, 600.0, d);
          float a = l * fade * uA * 0.4;
          gl_FragColor = vec4(vec3(0.1, 0.62, 1.0) * a, a);
        }`,
      blending: THREE.AdditiveBlending,
    });
    const floor = new THREE.Mesh(fgeo, gridMat);
    floor.rotation.x = -Math.PI / 2;
    floor.scale.set(60000, 60000, 1);
    floor.position.set(span / 2, -1120, 0);
    floor.renderOrder = 0;
    scene.add(floor);
    disposables.push(fgeo, gridMat);

    // ---- trilho: o caminho desenhado em luz ---------------------------------
    const tgeo = new THREE.TubeGeometry(rail, low ? 420 : 900, 7, 8, false);
    railMat = new THREE.ShaderMaterial({
      uniforms: { uDraw: { value: 0 }, uT: { value: 0 } },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: /* glsl */ `
        uniform float uDraw, uT; varying vec2 vUv;
        void main(){
          float on = step(vUv.x, uDraw);
          float spark = 0.0;
          for (int i = 0; i < 4; i++) {
            float run = fract(uT * 0.03 + float(i) / 4.0) * uDraw;
            spark += exp(-pow((vUv.x - run) * 260.0, 2.0));
          }
          float head = exp(-pow((vUv.x - uDraw) * 150.0, 2.0)) * smoothstep(0.0, 0.02, uDraw);
          float a = on * (0.34 + spark * 0.85) * smoothstep(0.0, 0.01, uDraw) + head * 1.4 * step(vUv.x, uDraw + 0.004);
          vec3 c = mix(vec3(0.1, 0.62, 1.0), vec3(1.0, 0.9, 0.3), clamp(head, 0.0, 1.0));
          gl_FragColor = vec4(c * a, a);
        }`,
    });
    const railMesh = new THREE.Mesh(tgeo, railMat);
    railMesh.renderOrder = 2;
    railMesh.frustumCulled = false;
    scene.add(railMesh);
    disposables.push(tgeo, railMat);
  }

  // ---------- laço ----------
  const size = { w: 1, h: 1, dpr: 1 };
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  let raf = 0;
  let last = 0;
  let clock = 0;
  let running = false;
  const center = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const m4 = new THREE.Matrix4();
  const m4b = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const v = new THREE.Vector3();
  const sc = new THREE.Vector3();
  let focusDist = 2000;

  function resize() {
    const w = persp.clientWidth || window.innerWidth;
    const h = persp.clientHeight || window.innerHeight;
    size.w = w;
    size.h = h;
    size.dpr = Math.min(window.devicePixelRatio || 1, low ? 1.25 : 1.75);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (renderer) {
      renderer.setPixelRatio(size.dpr);
      renderer.setSize(w, h, false);
    }
    camEl.style.width = `${w}px`;
    camEl.style.height = `${h}px`;
  }

  function applyCamera(t: number) {
    const idle = calm ? 0 : 1;
    const yaw = deg(cam.yaw + ptr.x * 1.7 * idle + Math.sin(t * 0.23) * 0.22 * idle);
    const pitch = deg(cam.pitch - ptr.y * 1.1 * idle + Math.sin(t * 0.19 + 1.3) * 0.16 * idle);
    const tan = Math.tan(deg(FOV) / 2);
    const fit = Math.max(cam.h / 2 / (1 - 2 * Math.abs(cam.oy)), cam.w / 2 / (camera.aspect * (1 - 2 * Math.abs(cam.ox)))) / tan;
    focusDist = fit;
    center.set(cam.cx, cam.cy, cam.cz);
    dir.set(Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), Math.cos(yaw) * Math.cos(pitch));
    camera.position.copy(center).addScaledVector(dir, fit);
    camera.up.set(0, 1, 0);
    camera.lookAt(center);
    if (cam.roll) camera.rotateZ(deg(cam.roll));
    // desloca a câmera no próprio plano: o conteúdo anda na tela sem mudar de perspectiva
    if (cam.ox) camera.translateX(-cam.ox * 2 * fit * tan * camera.aspect);
    if (cam.oy) camera.translateY(-cam.oy * 2 * fit * tan);
    camera.updateMatrixWorld(true);
  }

  function syncDom() {
    const fovPx = camera.projectionMatrix.elements[5] * (size.h / 2);
    persp.style.perspective = `${fovPx.toFixed(2)}px`;
    camEl.style.transform = `translateZ(${fovPx.toFixed(2)}px)${cameraCss(camera.matrixWorldInverse)}translate(${size.w / 2}px,${size.h / 2}px)`;
    camera.getWorldDirection(dir);
    for (const r of runtime) {
      const st = objs[r.spec.id];
      if (st.o <= 0.003 || st.s <= 0.0005) {
        if (r.visible) {
          r.el.style.visibility = 'hidden';
          r.visible = false;
        }
        continue;
      }
      if (!r.visible) {
        r.el.style.visibility = 'visible';
        r.visible = true;
      }
      v.set(st.x, st.y, st.z);
      const s = st.s / r.res;
      sc.set(s, s, s);
      if (r.spec.billboard) {
        m4.copy(camera.matrixWorldInverse).transpose();
        if (st.rz) m4.multiply(m4b.makeRotationZ(deg(st.rz)));
        m4.setPosition(v);
        m4.scale(sc);
        m4.elements[3] = m4.elements[7] = m4.elements[11] = 0;
        m4.elements[15] = 1;
      } else {
        e.set(deg(st.rx), deg(st.ry), deg(st.rz), 'YXZ');
        q.setFromEuler(e);
        m4.compose(v, q, sc);
      }
      const css = objectCss(m4);
      if (css !== r.lastT) {
        r.el.style.transform = css;
        r.lastT = css;
      }
      const o = st.o >= 0.997 ? 1 : +st.o.toFixed(3);
      if (o !== r.lastO) {
        r.el.style.opacity = o === 1 ? '' : String(o);
        r.lastO = o;
      }
      if (r.spec.dof && !low) {
        const d = v.sub(camera.position).dot(dir);
        const coc = Math.abs(d - focusDist) / Math.max(focusDist, 1);
        const b = Math.round(Math.min(12, Math.max(0, coc - 0.1) * 13) * 2) / 2;
        if (b !== r.lastB) {
          r.el.style.filter = b ? `blur(${b}px)` : '';
          r.lastB = b;
        }
      }
    }
  }

  function renderGl(t: number) {
    if (!renderer || !pUniforms) return;
    const f = Math.min(Math.max(fx.form, 0), forms.length - 1 - 1e-4);
    const i = Math.floor(f);
    if (i !== seg && aA && aB) {
      (aA.array as Float32Array).set(forms[i]);
      (aB.array as Float32Array).set(forms[i + 1]);
      aA.needsUpdate = true;
      aB.needsUpdate = true;
      seg = i;
    }
    pUniforms.uT.value = t;
    pUniforms.uMix.value = f - i;
    pUniforms.uTurb.value = fx.turb;
    pUniforms.uReveal.value = fx.reveal;
    pUniforms.uAlpha.value = fx.pAlpha;
    pUniforms.uBokeh.value = fx.bokeh;
    pUniforms.uTint.value = fx.tint;
    pUniforms.uFocus.value = focusDist;
    pUniforms.uScale.value = camera.projectionMatrix.elements[5] * (size.h / 2);
    pUniforms.uDpr.value = size.dpr;
    pUniforms.uPulse.value = calm ? 0.5 : 0.5 + 0.5 * Math.sin(t * 2.4);
    pUniforms.uSignal.value = fx.signal;

    if (mark) {
      const on = fx.mark > 0.004;
      mark.visible = on;
      if (on) {
        markMats.forEach((m) => (m.opacity = Math.min(1, fx.mark)));
        mark.rotation.set(deg(fx.markPitch - ptr.y * 5), deg(fx.markYaw + ptr.x * 8), 0);
        mark.scale.setScalar(fx.markScale * (0.94 + 0.06 * Math.min(1, fx.mark)));
      }
    }
    if (glowMat && glow) {
      glowMat.uniforms.uA.value = fx.glow;
      glow.position.set(fx.glowX, fx.glowY, -260);
    }
    if (gridMat) {
      gridMat.uniforms.uA.value = fx.grid;
      (gridMat.uniforms.uC.value as THREE.Vector3).set(cam.cx, 0, cam.cz);
    }
    if (railMat) {
      railMat.uniforms.uDraw.value = fx.rail;
      railMat.uniforms.uT.value = t;
    }
    renderer.render(scene, camera);
  }

  function frame(now: number) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0);
    last = now;
    clock += dt;
    const ease = 1 - Math.pow(0.0015, dt);
    ptr.x += (ptr.tx - ptr.x) * ease;
    ptr.y += (ptr.ty - ptr.y) * ease;
    applyCamera(clock);
    syncDom();
    renderGl(clock);
  }

  function loop(now: number) {
    if (!running) return;
    frame(now);
    raf = requestAnimationFrame(loop);
  }

  const onVis = () => {
    if (document.hidden) {
      running = false;
      cancelAnimationFrame(raf);
    } else if (!running) {
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    }
  };

  resize();
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVis);

  return {
    cam,
    fx,
    objs,
    webgl: !!renderer,
    start() {
      if (running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(loop);
    },
    /** render síncrono (capturas determinísticas e primeiro quadro) */
    renderNow() {
      frame(performance.now());
    },
    setPointer(nx: number, ny: number) {
      ptr.tx = nx;
      ptr.ty = ny;
    },
    resize,
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', onVis);
      disposables.forEach((d) => d.dispose());
      renderer?.dispose();
      for (const r of runtime) {
        r.el.style.cssText = '';
        const inner = r.el.firstElementChild as HTMLElement | null;
        if (inner) inner.style.cssText = '';
      }
    },
  };
}

export type Engine = ReturnType<typeof createEngine>;
