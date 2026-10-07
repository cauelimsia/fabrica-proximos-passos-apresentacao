import type { Engine } from './engine/engine';
import { BADGE_AT, DECIDE, END, FORMS, STATION, STATIONS, STEPS, panelPoint, railAt, type CamState, type Vec3 } from './engine/world';
import type { ChapterId } from './data';

type Gsap = typeof import('gsap').gsap;

/** duração de cada capítulo, em segundos de filme */
const LENGTHS: Record<ChapterId, number> = {
  fechado: 9.4,
  caminho: 10.4,
  inicio: 9.8,
  material: 10.4,
  montagem: 10.2,
  aprovacao: 10.4,
  noar: 12.8,
  rotina: 11.4,
  decisoes: 9.2,
  fecho: 10,
};

export const TIMES = (() => {
  const out = {} as Record<ChapterId, number>;
  let t = 0;
  (Object.keys(LENGTHS) as ChapterId[]).forEach((id) => {
    out[id] = t;
    t += LENGTHS[id];
  });
  return out;
})();
export const TOTAL = Object.values(LENGTHS).reduce((a, b) => a + b, 0);

type Shot = CamState;
const shot = (c: Vec3, w: number, h: number, yaw = 0, pitch = 0, roll = 0): Shot => ({
  cx: c[0],
  cy: c[1],
  cz: c[2],
  w,
  h,
  yaw,
  pitch,
  roll,
  ox: 0,
  oy: 0,
});

/** centro de cada coluna da estação, em px do painel */
const COL_A = { x: 306, y: 340 };
const COL_B = { x: 874, y: 340 };

export interface BuildArgs {
  gsap: Gsap;
  root: HTMLElement;
  engine: Engine;
  /** tela em pé: os enquadramentos fecham em uma coluna por vez */
  tall: boolean;
}

export function buildTimeline({ gsap, root, engine, tall }: BuildArgs) {
  const { cam, fx, objs } = engine;
  const world = root.querySelector<HTMLElement>('.sc-cam')!;
  const O = (id: string) => world.querySelector<HTMLElement>(`[data-obj="${id}"]`)!;
  const $ = (id: string, a: string) => Array.from(O(id).querySelectorAll<HTMLElement>(`[data-a="${a}"]`));
  const $c = (id: string, col: 'a' | 'b', a: string) => Array.from(O(id).querySelectorAll<HTMLElement>(`[data-col="${col}"] [data-a="${a}"]`));
  const hud = (sel: string) => root.querySelector<HTMLElement>(sel)!;
  const S = <T,>(wide: T, alt: T): T => (tall ? alt : wide);

  const tl = gsap.timeline({ paused: true, defaults: { ease: 'power2.out', duration: 0.6 } });

  // ------------------------------------------------------------ utilitários
  // ox/oy têm trilha própria (camOffset): os enquadramentos não mexem neles
  const camTo = (t: number, s: Shot, duration: number, ease = 'power2.inOut') => {
    const { ox: _ox, oy: _oy, ...frame } = s;
    void _ox;
    void _oy;
    return tl.to(cam, { ...frame, duration, ease }, t);
  };
  /** texto na coluna esquerda (tela larga) ou embaixo (tela em pé) */
  const SIDE = tall ? { ox: 0, oy: 0.11 } : { ox: 0.15, oy: 0 };
  const sideScrim = hud('.sc-scrim-side');
  const camOffset = (t: number, on: boolean, duration = 1.6) => {
    tl.to(sideScrim, { opacity: on ? 1 : 0, duration, ease: 'power2.inOut' }, t);
    return tl.to(cam, { ...(on ? SIDE : { ox: 0, oy: 0 }), duration, ease: 'power2.inOut' }, t);
  };

  const count = (el: HTMLElement, t: number, duration: number, to = +(el.dataset.count ?? 0)) => {
    const o = { v: 0 };
    el.textContent = '0';
    tl.to(o, { v: to, duration, ease: 'power2.out', onUpdate: () => void (el.textContent = String(Math.round(o.v))) }, t);
  };
  const show = (els: HTMLElement | HTMLElement[], t: number, from: gsap.TweenVars = {}, to: gsap.TweenVars = {}) =>
    tl.fromTo(els, { autoAlpha: 0, y: 14, ...from }, { autoAlpha: 1, y: 0, x: 0, z: 0, scale: 1, rotationX: 0, rotationY: 0, rotation: 0, duration: 0.6, ease: 'power3.out', ...to }, t);
  /** cartão que sobe do fundo e pousa no papel */
  const land = (els: HTMLElement | HTMLElement[], t: number, stagger = 0.14) =>
    tl.fromTo(els, { autoAlpha: 0, y: 60, z: -200, rotationX: -16 }, { autoAlpha: 1, y: 0, z: 0, rotationX: 0, duration: 1.0, ease: 'expo.out', stagger }, t);
  const pop = (els: HTMLElement | HTMLElement[], t: number, stagger = 0.1) =>
    tl.fromTo(els, { autoAlpha: 0, scale: 0.5 }, { autoAlpha: 1, scale: 1, duration: 0.5, ease: 'back.out(2)', stagger }, t);

  const copyEl = (id: string) => hud(`[data-copy="${id}"]`);
  const copyIn = (id: string, t: number) => {
    const el = copyEl(id);
    const words = el.querySelectorAll('.sc-w > span');
    const sub = el.querySelector('p');
    tl.set(el, { autoAlpha: 1 }, t);
    tl.fromTo(words, { yPercent: 115 }, { yPercent: 0, duration: 0.85, ease: 'expo.out', stagger: 0.04 }, t);
    if (sub) tl.fromTo(sub, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'power3.out' }, t + 0.35);
  };
  const copyOut = (id: string, t: number) => {
    const el = copyEl(id);
    const words = el.querySelectorAll('.sc-w > span');
    const sub = el.querySelector('p');
    tl.to(words, { yPercent: -115, duration: 0.45, ease: 'power3.in', stagger: 0.018 }, t);
    if (sub) tl.to(sub, { autoAlpha: 0, duration: 0.3, ease: 'power2.in' }, t);
    tl.set(el, { autoAlpha: 0 }, t + 0.75);
  };
  const scrim = hud('.sc-scrim');
  const scrimTo = (t: number, v: number) => tl.to(scrim, { opacity: v, duration: 0.8, ease: 'power2.inOut' }, t);
  /** liga um "feito": o círculo enche e o traço entra */
  const tickOn = (rows: HTMLElement[], t: number, each: number) =>
    rows.forEach((row, k) => {
      const dot = row.querySelector<HTMLElement>('.st-tick');
      const mark = row.querySelector<HTMLElement>('[data-a="tick"]');
      if (!dot || !mark) return;
      tl.fromTo(mark, { autoAlpha: 0, scale: 0.2 }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'back.out(2.6)' }, t + k * each);
      tl.fromTo(dot, { backgroundColor: 'rgba(12,42,71,0.1)' }, { backgroundColor: '#00a0e0', duration: 0.3 }, t + k * each);
    });

  // ------------------------------------------------------------ estações
  const stationShots = (i: number) => {
    const spec = STATIONS[i];
    const yaw = spec.rot![1];
    const a = panelPoint(spec, STATION, COL_A.x, COL_A.y);
    const b = panelPoint(spec, STATION, COL_B.x, COL_B.y);
    return {
      arrive: S(shot(spec.pos, 1640, 1040, yaw * 2.3, 3), shot(a, 760, 900, yaw * 1.6, 2)),
      settle: S(shot(spec.pos, 1500, 930, yaw * 0.3, 1), shot(a, 700, 900, yaw * 0.6, 1)),
      a: S(shot(spec.pos, 1500, 930, yaw * 0.3, 1), shot(a, 700, 900, yaw * 0.6, 1)),
      b: S(shot(spec.pos, 1450, 900, -yaw * 0.5, 1.5), shot(b, 700, 900, yaw * 0.6, 1)),
    };
  };
  /** a câmera chega, a estação sobe e a capa abre; `t` é o início do capítulo */
  const arrive = (i: number, t: number) => {
    const id = `s${i + 1}`;
    const o = objs[id];
    const p = STATIONS[i].pos;
    const shots = stationShots(i);
    tl.to(o, { o: 1, duration: 0.6 }, t - 1.5);
    tl.to(o, { s: 1, y: p[1], z: p[2], duration: 1.6, ease: 'expo.out' }, t - 1.4);
    // a primeira chegada vem de longe (vista geral): sai mais cedo para não deixar a tela vazia
    if (i === 0) camTo(t - 2.5, shots.arrive, 3.2);
    else camTo(t - 1.6, shots.arrive, 2.5);
    camTo(t + 0.9, shots.settle, 3.4, 'sine.inOut');
    if (i > 0) tl.to(objs[`s${i}`], { o: 0, duration: 0.9, ease: 'power2.in' }, t - 1.5);
    if (i + 1 < STEPS) tl.to(objs[`s${i + 2}`], { o: 0.5, duration: 1.2 }, t - 0.6);
    const cover = $(id, 'cover')[0];
    tl.to(cover, { rotationX: -96, autoAlpha: 0, duration: 0.9, ease: 'power3.in' }, t - 0.75);
    show($(id, 'head'), t - 0.1, { y: -16 }, { duration: 0.7 });
    return shots;
  };

  // estado inicial ------------------------------------------------------------
  const HOOK = S(shot([0, 0, 0], 1700, 1300), shot([0, 0, 0], 900, 1500));
  const BRAND = S(shot([0, -170, 0], 1500, 1260), shot([0, -220, 0], 760, 1500));
  gsap.set(cam, { ...HOOK, ox: 0, oy: 0 });
  gsap.set(fx, { form: FORMS.scatter, reveal: 0.07, pAlpha: 1, signal: 1, mark: 0, glow: 0, glowX: 0, glowY: 0, grid: 0, rail: 0, turb: 0, bokeh: 1, tint: 0, markYaw: -58, markPitch: 14, markScale: 1 });
  STATIONS.forEach((s, i) => {
    Object.assign(objs[`s${i + 1}`], { s: 0.82, y: s.pos[1] - 240, z: s.pos[2] - 200 });
    gsap.set($(`s${i + 1}`, 'head'), { autoAlpha: 0 });
  });

  // ================================================================ 1. FECHADO
  {
    const t = TIMES.fechado;
    const lock = hud('[data-lockup="open"]');
    const lockWords = lock.querySelectorAll('.sc-w > span');
    const lockRest = lock.querySelectorAll('.sc-kicker, p');
    // a página abre no título, parada; o filme começa quando ele sai
    gsap.set(lock, { autoAlpha: 1 });
    gsap.set(hud('.sc-ping'), { autoAlpha: 1 });
    tl.to(lockWords, { yPercent: -115, duration: 0.5, ease: 'power3.in', stagger: 0.04 }, t + 0.25);
    tl.to(lockRest, { autoAlpha: 0, duration: 0.35 }, t + 0.25);
    tl.set(lock, { autoAlpha: 0 }, t + 1.0);
    tl.to(hud('.sc-ping'), { autoAlpha: 0, duration: 0.5 }, t + 0.5);

    // o sinal vira o "feito"
    tl.to(fx, { reveal: 1, duration: 1.1, ease: 'power2.in' }, t + 0.5);
    tl.to(fx, { form: FORMS.mark, duration: 2.4, ease: 'power2.inOut' }, t + 0.7);
    tl.to(fx, { turb: 1, duration: 0.9, ease: 'power2.in' }, t + 0.7);
    tl.to(fx, { turb: 0, duration: 1.3, ease: 'power2.out' }, t + 1.8);
    tl.to(fx, { signal: 0, duration: 0.6 }, t + 1.6);
    camTo(t + 0.5, BRAND, 3.4);
    tl.to(fx, { glow: 0.9, duration: 1.6, ease: 'power2.out' }, t + 1.9);
    tl.to(fx, { mark: 1, duration: 0.9, ease: 'power2.out' }, t + 2.4);
    tl.to(fx, { markYaw: -16, markPitch: 5, duration: 2.6, ease: 'expo.out' }, t + 2.4);
    tl.to(fx, { pAlpha: 0.5, duration: 1.1 }, t + 2.8);
    tl.to(fx, { bokeh: 0.35, duration: 1.2 }, t + 1.6);
    tl.fromTo(hud('.sc-mark-fallback'), { autoAlpha: 0 }, { autoAlpha: engine.webgl ? 0 : 1, duration: 0.6 }, t + 2.4);
    tl.to(hud('.sc-mark-fallback'), { autoAlpha: 0, duration: 0.5 }, t + LENGTHS.fechado);

    copyIn('open-a', t + 2.9);
    copyOut('open-a', t + 5.4);
    copyIn('open-b', t + 5.9);
    copyOut('open-b', t + 8.5);
    tl.to(fx, { markYaw: 14, duration: 5.4, ease: 'sine.inOut' }, t + 4.6);
  }

  // ================================================================ 2. O CAMINHO
  {
    const t = TIMES.caminho;
    const mid = (STATIONS[0].pos[0] + STATIONS[STEPS - 1].pos[0]) / 2;
    const A = S(shot([mid - 1500, -430, 0], 12400, 3600, -30, 8), shot([STATIONS[0].pos[0] + 1000, -220, 0], 4500, 7200, -12, 6));
    const B = S(shot([mid + 700, -320, 0], 11600, 4000, 18, 6), shot([STATIONS[STEPS - 1].pos[0] - 1000, 240, 0], 4500, 7200, 12, 6));

    tl.to(fx, { mark: 0, duration: 0.8, ease: 'power2.in' }, t + 0.1);
    tl.to(fx, { markYaw: 70, markScale: 0.7, duration: 0.9, ease: 'power2.in' }, t + 0.1);
    tl.to(fx, { glow: 0.2, duration: 1.2 }, t + 0.1);
    tl.to(fx, { pAlpha: 1, bokeh: 0.8, duration: 0.9 }, t + 0.2);
    tl.to(fx, { form: FORMS.path, duration: 3.2, ease: 'power2.inOut' }, t + 0.2);
    tl.to(fx, { turb: 0.8, duration: 0.9 }, t + 0.2);
    tl.to(fx, { turb: 0, duration: 1.6 }, t + 1.4);
    tl.to(fx, { grid: 1, duration: 2.4, ease: 'power2.out' }, t + 1.2);
    camTo(t + 0.2, A, 3.2);
    camTo(t + 3.6, B, 4.3, 'sine.inOut');
    tl.to(fx, { rail: railAt(STEPS), duration: 4.6, ease: 'power1.inOut' }, t + 1.6);

    STATIONS.forEach((s, i) => {
      const o = objs[`s${i + 1}`];
      const lb = objs[`lb${i + 1}`];
      const at = t + 1.5 + i * 0.5;
      tl.to(o, { o: 1, duration: 0.6 }, at);
      tl.fromTo(o, { s: 0.5 }, { s: 0.82, duration: 1.0, ease: 'back.out(1.6)' }, at);
      tl.to(lb, { o: 1, duration: 0.6 }, at + 0.3);
      tl.fromTo(lb, { y: s.pos[1] + 400 }, { y: s.pos[1] + 520, duration: 0.9, ease: 'power3.out' }, at + 0.3);
      tl.to(lb, { o: 0, duration: 0.5, ease: 'power2.in' }, t + LENGTHS.caminho - 2.7 + i * 0.04);
      if (i > 0) tl.to(o, { o: 0, duration: 0.7, ease: 'power2.in' }, t + LENGTHS.caminho - 2.4);
    });

    copyIn('path-a', t + 1.9);
    copyOut('path-a', t + 5.0);
    copyIn('path-b', t + 5.5);
    copyOut('path-b', t + 7.7);
    scrimTo(t + 1.6, 0.7);
    scrimTo(t + 7.6, 0);
    tl.to(fx, { form: FORMS.dust, duration: 3.4, ease: 'power2.inOut' }, t + 7.6);
    tl.to(fx, { pAlpha: 0.75, bokeh: 1, duration: 1.6 }, t + 8.6);
    camOffset(t + LENGTHS.caminho - 1.4, true, 2.2);
  }

  // ================================================================ 3. REUNIÃO
  {
    const t = TIMES.inicio;
    const id = 's1';
    const shots = arrive(0, t);
    land($c(id, 'a', 'card'), t + 0.2);
    const rows = $c(id, 'a', 'row');
    show(rows, t + 0.7, { x: -16, y: 0 }, { stagger: 0.09, duration: 0.5 });
    gsap.set(rows.map((r) => r.querySelector('[data-a="tick"]')), { autoAlpha: 0 });
    tickOn(rows, t + 1.7, 0.42);

    camTo(t + 4.3, shots.b, S(3.6, 1.4), S('sine.inOut', 'power2.inOut'));
    land($c(id, 'b', 'card'), t + 4.0, 0.5);
    pop($(id, 'seat'), t + 4.6, 0.16);
    const timer = $(id, 'timer')[0];
    const clock = { v: 0 };
    tl.to(clock, { v: 60, duration: 3.4, ease: 'power1.inOut', onUpdate: () => void (timer.textContent = `${String(Math.round(clock.v)).padStart(2, '0')}:00`) }, t + 5.0);
    tl.fromTo($(id, 'bar'), { scaleY: 0.18 }, { scaleY: 1, duration: 0.42, ease: 'sine.inOut', stagger: { each: 0.035, repeat: 7, yoyo: true } }, t + 4.9);
    tl.fromTo($(id, 'rec-dot'), { scale: 0.6 }, { scale: 1.15, duration: 0.5, ease: 'sine.inOut', repeat: 7, yoyo: true }, t + 4.9);

    copyIn('s1', t + 0.5);
    copyOut('s1', t + LENGTHS.inicio - 1.5);
  }

  // =============================================================== 4. MATERIAL
  {
    const t = TIMES.material;
    const id = 's2';
    const shots = arrive(1, t);
    const docs = $(id, 'doc');
    // grade 2×3: valores, turmas / contrato, calendário / conversas, (fora)
    const from = [
      { x: -340, y: -180, rotationY: 34, rotationX: 22 },
      { x: 340, y: -220, rotationY: -34, rotationX: 24 },
      { x: -420, y: 40, rotationY: 40, rotationX: -8 },
      { x: 420, y: 20, rotationY: -40, rotationX: -10 },
      { x: -300, y: 240, rotationY: 30, rotationX: -26 },
    ];
    docs.forEach((d, k) => {
      tl.fromTo(d, { autoAlpha: 0, z: 620, scale: 1.12, ...from[k] }, { autoAlpha: 1, x: 0, y: 0, z: 0, scale: 1, rotationX: 0, rotationY: 0, duration: 1.25, ease: 'expo.out' }, t + 0.3 + k * 0.4);
    });
    const stamps = $(id, 'stamp');
    const stampAt = [3.0, 6.3, 3.5, 6.8, 4.0];
    stamps.forEach((s, k) => {
      tl.fromTo(s, { autoAlpha: 0, scale: 2.4, rotation: -22, z: 120 }, { autoAlpha: 1, scale: 1, rotation: -6, z: 14, duration: 0.42, ease: 'power4.in' }, t + stampAt[k]);
    });
    camTo(t + 4.6, shots.b, S(3.8, 1.4), S('sine.inOut', 'power2.inOut'));
    const out = $(id, 'out')[0];
    tl.fromTo(out, { autoAlpha: 0, scale: 0.9, z: -120 }, { autoAlpha: 1, scale: 1, z: 0, duration: 0.8, ease: 'expo.out' }, t + 7.4);
    tl.fromTo(out, { x: 0 }, { x: 7, duration: 0.07, repeat: 5, yoyo: true, ease: 'none' }, t + 8.1);

    copyIn('s2', t + 0.5);
    copyOut('s2', t + LENGTHS.material - 1.5);
  }

  // =============================================================== 5. MONTAGEM
  {
    const t = TIMES.montagem;
    const id = 's3';
    const shots = arrive(2, t);
    land($c(id, 'a', 'card'), t + 0.2);
    show($c(id, 'a', 'row'), t + 0.7, { x: -16, y: 0 }, { stagger: 0.12, duration: 0.5 });
    const pills = $(id, 'pill');
    gsap.set(pills.map((p) => p.querySelector('svg')), { autoAlpha: 0, scale: 0.2 });
    pills.forEach((p, k) => {
      const at = t + 1.7 + k * 0.3;
      tl.to(p, { backgroundColor: '#00a0e0', color: '#ffffff', duration: 0.3 }, at);
      tl.to(p, { z: 26, duration: 0.2, ease: 'power2.out' }, at);
      tl.to(p, { z: 0, duration: 0.5, ease: 'power2.inOut' }, at + 0.2);
      tl.to(p.querySelector('svg'), { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'back.out(2.6)' }, at);
    });

    camTo(t + 4.5, shots.b, S(3.8, 1.4), S('sine.inOut', 'power2.inOut'));
    land($c(id, 'b', 'card'), t + 4.2, 1.7);
    const mods = $(id, 'mod');
    pop(mods, t + 4.8, 0.13);
    mods.forEach((m, k) => tl.to(m.querySelector('i'), { backgroundColor: '#00a0e0', boxShadow: '0 0 0 4px rgba(0,160,224,0.2)', duration: 0.3 }, t + 5.1 + k * 0.13));
    show($(id, 'rule'), t + 6.5, { x: -14, y: 0 }, { stagger: 0.3, duration: 0.5 });

    copyIn('s3', t + 0.5);
    copyOut('s3', t + LENGTHS.montagem - 1.5);
  }

  // ============================================================== 6. APROVAÇÃO
  {
    const t = TIMES.aprovacao;
    const id = 's4';
    const shots = arrive(3, t);
    land($c(id, 'a', 'card'), t + 0.2);
    const rows = $c(id, 'a', 'row');
    show(rows, t + 0.7, { x: -16, y: 0 }, { stagger: 0.09, duration: 0.5 });
    gsap.set($(id, 'ok'), { autoAlpha: 0, x: 10 });
    rows.forEach((row, k) => {
      const at = t + 1.6 + k * 0.42;
      tl.to(row.querySelector('[data-a="sw"]'), { backgroundColor: '#00a0e0', duration: 0.25 }, at);
      tl.to(row.querySelector('[data-a="knob"]'), { x: 24, duration: 0.3, ease: 'back.out(2)' }, at);
      tl.to(row.querySelector('[data-a="ok"]'), { autoAlpha: 1, x: 0, duration: 0.3 }, at + 0.05);
    });

    camTo(t + 4.5, shots.b, S(3.8, 1.4), S('sine.inOut', 'power2.inOut'));
    land($c(id, 'b', 'card'), t + 4.2);
    tl.fromTo($(id, 'q'), { autoAlpha: 0, x: -18, scale: 0.94, transformOrigin: '0% 100%' }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, t + 5.0);
    tl.fromTo($(id, 'ans'), { autoAlpha: 0, x: 18, scale: 0.94, transformOrigin: '100% 100%' }, { autoAlpha: 1, x: 0, scale: 1, duration: 0.5, ease: 'back.out(1.5)' }, t + 5.8);
    show($(id, 'verdict'), t + 6.5);
    const yes = $(id, 'yes')[0];
    tl.to(yes, { backgroundColor: '#00a0e0', borderColor: '#00a0e0', color: '#ffffff', duration: 0.25 }, t + 7.1);
    tl.fromTo(yes, { scale: 1 }, { scale: 0.93, duration: 0.09, repeat: 1, yoyo: true, immediateRender: false }, t + 7.1);
    tl.fromTo($(id, 'seal'), { autoAlpha: 0, scale: 2.6, rotation: -24, z: 320 }, { autoAlpha: 1, scale: 1, rotation: -7, z: 60, duration: 0.5, ease: 'power4.in' }, t + 7.7);
    tl.to($(id, 'seal'), { z: 34, duration: 1.2, ease: 'elastic.out(1, 0.5)' }, t + 8.2);

    copyIn('s4', t + 0.5);
    copyOut('s4', t + LENGTHS.aprovacao - 1.5);
  }

  // ================================================================= 7. NO AR
  {
    const t = TIMES.noar;
    const id = 's5';
    const shots = arrive(4, t);
    land($c(id, 'a', 'card'), t + 0.2);
    const msgs = Object.fromEntries($(id, 'msg').map((m) => [m.dataset.msg!, m]));
    gsap.set(Object.values(msgs), { autoAlpha: 0 });
    const msgIn = (key: string, at: number) => {
      const m = msgs[key];
      const out = m.classList.contains('st-msg--ia');
      const sys = m.classList.contains('st-sys');
      tl.fromTo(
        m,
        { autoAlpha: 0, y: 16, x: sys ? 0 : out ? 18 : -18, scale: 0.92, transformOrigin: sys ? '50% 50%' : out ? '100% 0%' : '0% 0%' },
        { autoAlpha: 1, y: 0, x: 0, scale: 1, duration: 0.5, ease: 'back.out(1.6)' },
        at,
      );
    };
    msgIn('m1', t + 1.0);
    msgIn('a1', t + 2.0);
    msgIn('m2', t + 3.5);

    // o funil acompanha a conversa: a família anda de "Contato" para "Visita"
    land($c(id, 'b', 'card'), t + S(1.0, 3.6));
    const lead = $(id, 'lead')[0];
    const stages = $(id, 'stage');
    const stepY = stages[1].offsetTop - stages[0].offsetTop;
    tl.fromTo(lead, { autoAlpha: 0, scale: 0.6, z: 80 }, { autoAlpha: 1, scale: 1, z: 22, duration: 0.5, ease: 'back.out(1.8)' }, t + S(1.6, 4.4));
    tl.to(lead, { y: stepY, duration: 0.8, ease: 'power3.inOut' }, t + 5.0);
    tl.to(stages[1], { color: '#0089c4', duration: 0.3 }, t + 5.4);

    msgIn('a2', t + 7.0);
    msgIn('s1', t + 8.0);
    const handoff = $(id, 'handoff')[0];
    tl.fromTo(handoff, { autoAlpha: 0, y: 40, z: 160, rotationX: -14 }, { autoAlpha: 1, y: 0, z: 30, rotationX: 0, duration: 0.9, ease: 'expo.out' }, t + S(8.6, 9.5));
    tl.to(handoff, { z: 0, duration: 1.2, ease: 'power2.inOut' }, t + S(9.8, 10.6));

    if (tall) {
      camTo(t + 3.7, shots.b, 1.3);
      camTo(t + 5.9, shots.a, 1.2);
      camTo(t + 8.6, shots.b, 1.2);
    } else {
      camTo(t + 5.8, shots.b, 4.6, 'sine.inOut');
    }

    copyIn('s5a', t + 0.5);
    copyOut('s5a', t + 5.9);
    copyIn('s5b', t + 6.6);
    copyOut('s5b', t + LENGTHS.noar - 1.5);
  }

  // ================================================================ 8. ROTINA
  {
    const t = TIMES.rotina;
    const id = 's6';
    const shots = arrive(5, t);
    const kpis = $(id, 'kpi');
    tl.fromTo(kpis, { autoAlpha: 0, y: 60, z: -240, rotationX: -22 }, { autoAlpha: 1, y: 0, z: 40, rotationX: 0, duration: 1.0, ease: 'expo.out', stagger: 0.14 }, t + 0.3);
    tl.to(kpis, { z: 0, duration: 1.2, ease: 'power2.inOut', stagger: 0.06 }, t + 2.6);
    kpis.forEach((k, i) => count(k.querySelector<HTMLElement>('[data-count]')!, t + 0.7 + i * 0.14, 1.6));
    land($c(id, 'a', 'card'), t + 1.2);
    $c(id, 'a', 'stage').forEach((s, k) => {
      tl.fromTo(s, { autoAlpha: 0, x: -14 }, { autoAlpha: 1, x: 0, duration: 0.4 }, t + 1.8 + k * 0.2);
      tl.fromTo(s.querySelector('[data-a="fill"]'), { scaleX: 0 }, { scaleX: 1, duration: 0.9, ease: 'expo.out' }, t + 1.9 + k * 0.2);
      count(s.querySelector<HTMLElement>('[data-count]')!, t + 1.9 + k * 0.2, 1.1);
    });

    camTo(t + 5.0, shots.b, S(4.2, 1.4), S('sine.inOut', 'power2.inOut'));
    land($c(id, 'b', 'card'), t + 4.8);
    const packs = $(id, 'pack');
    gsap.set(packs.map((p) => p.querySelector('[data-a="tick"]')), { autoAlpha: 0 });
    tl.fromTo(packs, { autoAlpha: 0, y: 30, z: -120 }, { autoAlpha: 1, y: 0, z: 0, duration: 0.8, ease: 'expo.out', stagger: 0.32 }, t + 5.5);
    tickOn(packs, t + 5.9, 0.32);

    copyIn('s6a', t + 0.5);
    copyOut('s6a', t + 5.1);
    copyIn('s6b', t + 5.8);
    copyOut('s6b', t + LENGTHS.rotina - 1.6);
  }

  // ============================================================== 9. DECISÕES
  {
    const t = TIMES.decisoes;
    const ids = ['d1', 'd2', 'd3'];
    const WIDE = shot([DECIDE[0], DECIDE[1] - 190, 0], 2400, 1340, -7, 3);
    const WIDE_B = shot([DECIDE[0], DECIDE[1] - 190, 0], 2240, 1260, 6, 2);
    camOffset(t - 1.5, false, 1.8);
    tl.to(objs.s6, { o: 0, duration: 0.9, ease: 'power2.in' }, t - 1.3);
    tl.to(fx, { rail: railAt(STEPS + 1), duration: 2.4, ease: 'power2.inOut' }, t - 1.4);
    tl.to(fx, { pAlpha: 1, duration: 1.2 }, t - 1.0);

    if (tall) {
      const p = (id: string): Vec3 => [objs[id].x, objs[id].y - 120, 0];
      camTo(t - 1.5, shot(p('d1'), 700, 1300, 10, 2), 2.6);
      camTo(t + 2.9, shot(p('d2'), 700, 1300, 0, 2), 1.4);
      camTo(t + 5.3, shot(p('d3'), 700, 1300, -10, 2), 1.4);
    } else {
      camTo(t - 1.5, WIDE, 2.8);
      camTo(t + 1.6, WIDE_B, 5.6, 'sine.inOut');
    }

    ids.forEach((id, i) => {
      const o = objs[id];
      const y = o.y;
      const at = t - 0.5 + i * S(0.45, 2.3);
      tl.to(o, { o: 1, duration: 0.6 }, at);
      tl.fromTo(o, { y: y - 260, s: 0.8, rx: 26 }, { y, s: 1, rx: 0, duration: 1.3, ease: 'expo.out' }, at);
      tl.fromTo($(id, 'tag'), { autoAlpha: 0, scale: 0.6, transformOrigin: '0% 50%' }, { autoAlpha: 1, scale: 1, duration: 0.45, ease: 'back.out(2)' }, at + 1.0);
      tl.to(o, { y: y + (i % 2 ? -22 : 26), duration: 5.4, ease: 'sine.inOut' }, at + 1.3);
    });

    copyIn('dec', t + 0.9);
    copyOut('dec', t + LENGTHS.decisoes - 1.7);
    scrimTo(t + 0.4, 0.75);
    scrimTo(t + LENGTHS.decisoes - 1.6, 0);
  }

  // ================================================================= 10. FECHO
  {
    const t = TIMES.fecho;
    const FAR = S(shot([END[0], END[1] - 60, 0], 2300, 1700, -10, 4), shot([END[0], END[1] - 300, 0], 1900, 3600, -8, 3));
    const NEAR = S(shot([END[0], END[1] - 210, 0], 1900, 1700, 0, 1), shot([END[0], END[1] - 430, 0], 1400, 2800, 0, 1));
    ['d1', 'd2', 'd3'].forEach((id, i) => tl.to(objs[id], { o: 0, duration: 0.7, ease: 'power2.in' }, t - 1.5 + i * 0.08));
    camTo(t - 1.5, FAR, 3.0);
    camTo(t + 1.6, NEAR, 4.4, 'sine.inOut');
    tl.to(fx, { rail: 1, duration: 2.6, ease: 'power2.inOut' }, t - 1.4);
    tl.to(fx, { grid: 0.35, duration: 2.0 }, t);

    // a poeira do caminho inteiro converge e desenha a logo, cor por cor
    tl.set(fx, { glowX: BADGE_AT[0], glowY: BADGE_AT[1] }, t - 1.5);
    tl.to(fx, { form: FORMS.badge, duration: 3.6, ease: 'power2.inOut' }, t - 1.2);
    tl.to(fx, { turb: 0.9, duration: 1.0, ease: 'power2.in' }, t - 1.0);
    tl.to(fx, { turb: 0, duration: 1.6, ease: 'power2.out' }, t + 0.4);
    tl.to(fx, { tint: 1, duration: 1.6, ease: 'power2.inOut' }, t + 0.5);
    tl.to(fx, { bokeh: 0.2, duration: 1.4 }, t + 0.4);
    tl.to(fx, { glow: 0.75, duration: 1.8, ease: 'power2.out' }, t + 1.2);

    // a logo de verdade assenta por cima das partículas
    const badge = objs.badge;
    tl.to(badge, { o: 1, duration: 1.1, ease: 'power2.inOut' }, t + 2.5);
    tl.fromTo(badge, { s: 0.94 }, { s: 1, duration: 1.6, ease: 'expo.out' }, t + 2.5);
    tl.to(fx, { pAlpha: 0.4, duration: 1.4 }, t + 2.9);
    tl.to(fx, { tint: 0, duration: 1.6 }, t + 3.6);

    const lock = hud('[data-lockup="close"]');
    tl.set(lock, { autoAlpha: 1 }, t + 3.6);
    tl.fromTo(lock.querySelectorAll('.sc-w > span'), { yPercent: 115 }, { yPercent: 0, duration: 0.95, ease: 'expo.out', stagger: 0.07 }, t + 3.6);
    tl.fromTo(lock.querySelector(':scope > p'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.8 }, t + 4.1);
    tl.fromTo(lock.querySelector('.sc-cta'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.8 }, t + 4.6);
    tl.fromTo(lock.querySelector('.sc-team'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8 }, t + 5.2);
    tl.fromTo(lock.querySelector('.sc-team img'), { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.7 }, t + 5.5);
    scrimTo(t + 3.2, 0.8);
  }

  // garante a duração exata do filme (a rolagem é mapeada em TOTAL)
  tl.set({}, {}, TOTAL);
  return tl;
}
