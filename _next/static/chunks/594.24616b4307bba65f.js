"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[594],{2594:(e,t,a)=>{a.r(t),a.d(t,{createEngine:()=>u});var n=a(5269),i=a(9625),l=a(786),o=a(9724);let r=e=>1e-6>Math.abs(e)?0:+e.toFixed(5);class s extends n.B6O{getPointAt(e,t){return this.getPoint(e,t)}getTangentAt(e,t){return this.getTangent(e,t)}}function u(e){let t,{canvas:a,persp:u,camEl:c,calm:v,low:d,badge:p}=e,h=(t=0x1306ae3,()=>{t|=0;let e=Math.imul((t=t+0x6d2b79f5|0)^t>>>15,1|t);return(((e=e+Math.imul(e^e>>>7,61|e)^e)^e>>>14)>>>0)/0x100000000}),f={cx:0,cy:0,cz:0,w:1700,h:1e3,yaw:0,pitch:0,roll:0,ox:0,oy:0},m={form:0,turb:0,reveal:0,pAlpha:1,bokeh:1,tint:0,mark:0,markYaw:0,markPitch:0,markScale:1,glow:0,glowX:0,glowY:0,grid:0,rail:0,signal:0},w={},x=[];for(let e of o.fQ){let t=c.querySelector(`[data-obj="${e.id}"]`);if(!t)continue;let a=t.firstElementChild,n=d?Math.min(e.res??1,1.15):e.res??1,i=a.offsetWidth,l=a.offsetHeight;a.style.width=`${i}px`,a.style.height=`${l}px`,a.style.transform=`scale(${n})`,t.style.width=`${i*n}px`,t.style.height=`${l*n}px`,t.dataset.w=String(i),t.dataset.h=String(l),w[e.id]={x:e.pos[0],y:e.pos[1],z:e.pos[2],rx:e.rot?.[0]??0,ry:e.rot?.[1]??0,rz:e.rot?.[2]??0,s:e.scale??1,o:0},t.style.visibility="hidden",x.push({spec:e,el:t,res:n,visible:!1,lastT:"",lastO:-1,lastB:-1})}let g=null;try{g=new i.JeP({canvas:a,antialias:!d,alpha:!0,powerPreference:"high-performance"})}catch{g=null}let y=new n.Z58,M=new n.ubm(32,1,20,6e4),b=[],k=null,A=null,$=[],P=null,S=null,T=null,z=null,F=[],C=null,R=null,B=-1;if(g){g.setClearColor(0,0),g.toneMapping=n.FV,g.toneMappingExposure=1.05,g.outputColorSpace=n.er$;let e=d?6e3:2e4,t=(0,l.Or)(430),a=(0,l.Cu)(430),r=new s(o.L5.map(e=>new n.Pq0(...e)),!1,"catmullrom",.5),u=new Float32Array(3*e),c=new Float32Array(3*e),v=new Float32Array(3*e),f=new Float32Array(3*e),m=new Float32Array(3*e),w=new Float32Array(3*e),x=new Float32Array(4*e),M=()=>{let e=0,t=0;for(;0===e;)e=h();for(;0===t;)t=h();return Math.sqrt(-2*Math.log(e))*Math.cos(2*Math.PI*t)},B=[];if(p){let e=p.data;for(let t=0;t<p.w*p.h;t++)e[4*t+3]>150&&!(e[4*t]>236&&e[4*t+1]>236&&e[4*t+2]>236)&&B.push(t)}let E=p?o.yq.h/p.h:1,U=new n.Pq0,I=o.UZ[o.UZ.length-1].pos,W=o.Kp[0]+2600;for(let n=0;n<e;n++){let e=3*n;if(0===n)u[0]=u[1]=u[2]=0;else{let t=260+2400*Math.pow(h(),.6),a=h()*Math.PI*2;u[e]=Math.cos(a)*t*1.25,u[e+1]=Math.sin(a)*t*.7,u[e+2]=-1900+2500*h()}if(.76>h()){let n=0,i=0;for(let e=0;e<40&&(n=(h()-.5)*a,i=(h()-.5)*430,!(0,l.s3)(n,i,t));e++);c[e]=n,c[e+1]=i,c[e+2]=(h()-.5)*46}else{let t=420+1500*h(),a=h()*Math.PI*2;c[e]=Math.cos(a)*t*1.3,c[e+1]=Math.sin(a)*t*.72,c[e+2]=-1500+1500*h()}let i=h();if(i<.5){let t=o.UZ[Math.floor(h()*o.UZ.length)].pos,a=190+230*h();v[e]=t[0]+M()*a,v[e+1]=t[1]+M()*a*.8,v[e+2]=t[2]-120+M()*a}else i<.78?(r.getPoint(h(),U),v[e]=U.x+70*M(),v[e+1]=U.y+46*M(),v[e+2]=U.z+70*M()):(v[e]=-1200+h()*(I[0]+3600),v[e+1]=(h()-.5)*3600,v[e+2]=-2600+3e3*h());let s=.05>h(),d=-2600+h()*(W+2600);f[e]=d,f[e+1]=d/W*900-300+(h()-.5)*3400,f[e+2]=s?500+1e3*h():-3200+2700*h();let g=.55,y=.57,b=1;if(B.length&&.82>h()){let t=B[Math.floor(h()*B.length)],a=t%p.w,n=Math.floor(t/p.w);m[e]=o.Iz[0]+(a-p.w/2+h()-.5)*E,m[e+1]=o.Iz[1]+(p.h/2-n+h()-.5)*E,m[e+2]=o.Iz[2]+(h()-.5)*34,g=p.data[4*t]/255;let i=Math.min(2.2,.92/Math.max(g,y=p.data[4*t+1]/255,b=p.data[4*t+2]/255,.05));i>1&&(g*=i,y*=i,b*=i)}else{let t=520+1700*h(),a=h()*Math.PI*2;m[e]=o.Iz[0]+Math.cos(a)*t*1.3,m[e+1]=o.Iz[1]+Math.sin(a)*t*.72,m[e+2]=o.Iz[2]-1500+1500*h()}w[e]=g,w[e+1]=y,w[e+2]=b,x[4*n]=0===n?0:h(),x[4*n+1]=h(),x[4*n+2]=h(),x[4*n+3]=h()}F.push(u,c,v,f,m);let Z=new n.LoY;C=new n.THS(new Float32Array(u),3),R=new n.THS(new Float32Array(c),3),C.setUsage(n.Vnu),R.setUsage(n.Vnu),Z.setAttribute("position",C),Z.setAttribute("aB",R),Z.setAttribute("aRnd",new n.THS(x,4)),Z.setAttribute("aCol",new n.THS(w,3)),Z.boundingSphere=new n.iyt(new n.Pq0,1e6),k={uT:{value:0},uMix:{value:0},uTurb:{value:0},uReveal:{value:0},uAlpha:{value:1},uBokeh:{value:1},uTint:{value:0},uFocus:{value:2e3},uScale:{value:1500},uDpr:{value:1},uPulse:{value:0},uSignal:{value:0}};let _=new n.BKk({uniforms:k,transparent:!0,depthWrite:!1,blending:n.EZo,vertexShader:`
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
          vAcc = fract(aRnd.w * 37.13 + aRnd.y * 11.7);
          vCol = aCol;
        }`,fragmentShader:`
        uniform float uTint;
        varying float vAlpha;
        varying float vTone;
        varying float vAcc;
        varying vec3 vCol;
        vec3 faixa(float k) {
          if (k < 1.0) return vec3(0.50, 0.82, 0.16);
          if (k < 2.0) return vec3(0.96, 0.26, 0.14);
          if (k < 3.0) return vec3(0.33, 0.78, 0.96);
          if (k < 4.0) return vec3(0.26, 0.42, 0.98);
          if (k < 5.0) return vec3(0.96, 0.20, 0.15);
          if (k < 6.0) return vec3(0.26, 0.76, 0.26);
          return vec3(0.99, 0.82, 0.06);
        }
        void main() {
          float r = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, r);
          a = a * a * (0.55 + 0.45 * smoothstep(0.22, 0.0, r));
          // c\xe9u \xedndigo da logo, com confete nas sete cores da faixa
          vec3 col = mix(vec3(0.42, 0.45, 1.0), vec3(0.80, 0.82, 1.0), smoothstep(0.35, 1.0, vTone));
          col = mix(col, faixa(floor(vAcc / 0.4 * 7.0)), step(vAcc, 0.4));
          col = mix(col, vec3(1.0), smoothstep(0.18, 0.0, r) * 0.5);
          col = mix(col, vCol * 0.92 + 0.04, uTint);
          gl_FragColor = vec4(col * a * vAlpha, a * vAlpha);
        }`}),D=new n.ONl(Z,_);D.renderOrder=3,D.frustumCulled=!1,y.add(D),b.push(Z,_);let q=new n.Z58,O=(e,t,a,i,l=[0,0,0])=>{let o=new n.bdM(e,t),r=new n.V9B({color:a,side:n.$EB}),s=new n.eaF(o,r);s.position.set(...i),s.lookAt(...l),q.add(s),b.push(o,r)};q.background=new n.Q1f(394780);let L=new n.Gu$(40,32,16),j=new n.BKk({side:n.hsX,vertexShader:"varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`
        varying vec3 vP;
        void main(){
          float up = vP.y * 0.5 + 0.5;
          vec3 low = vec3(0.02, 0.02, 0.09);
          vec3 mid = vec3(0.14, 0.15, 0.58);
          vec3 top = vec3(1.7, 1.7, 2.2);
          vec3 c = mix(low, mid, smoothstep(0.0, 0.55, up));
          c = mix(c, top, smoothstep(0.55, 1.0, up));
          c += vec3(1.0, 1.1, 2.6) * pow(max(dot(vP, normalize(vec3(-0.75, 0.25, 0.6))), 0.0), 6.0);
          c += vec3(2.2, 1.7, 0.4) * pow(max(dot(vP, normalize(vec3(0.85, -0.1, 0.5))), 0.0), 12.0);
          gl_FragColor = vec4(c, 1.0);
        }`});q.add(new n.eaF(L,j)),b.push(L,j),O(14,5,new n.Q1f(7,7.6,8.5),[0,9,3]),O(3,12,new n.Q1f(2.6,2.8,9),[-10,1,2]),O(2.2,10,new n.Q1f(5,6.4,9),[10,2,-2]),O(8,1.2,new n.Q1f(1.8,2,6),[0,-8,4]),O(5,5,new n.Q1f(1,1.6,2.4),[0,0,12]);let V=new i.BdL(g),Q=V.fromScene(q,.035);y.environment=Q.texture,b.push(Q,V);let Y=new n.ypk;t.forEach(([e,t],a)=>a?Y.lineTo(e,t):Y.moveTo(e,t)),Y.closePath();let H=new n.QCA(Y,{depth:96,bevelEnabled:!0,bevelThickness:12,bevelSize:10,bevelOffset:-10,bevelSegments:d?3:7,curveSegments:12});H.translate(0,0,-48);let K=new n.uSd({color:2598955,metalness:.2,roughness:.36,clearcoat:.7,clearcoatRoughness:.14,envMapIntensity:.42,emissive:1477148,emissiveIntensity:.62,transparent:!0,opacity:0}),N=new n.uSd({color:7329871,metalness:.4,roughness:.24,clearcoat:1,clearcoatRoughness:.06,envMapIntensity:.8,emissive:4044861,emissiveIntensity:.3,transparent:!0,opacity:0});$=[K,N],(A=new n.YJl).add(new n.eaF(H,$)),A.renderOrder=1,A.visible=!1,y.add(A),b.push(H,K,N);let X=new n.ZyN(0xffffff,2.4);X.position.set(-700,900,1300);let J=new n.ZyN(0xb9bcff,1.6);J.position.set(900,-200,-700),y.add(X,J,new n.$p8(6975216,.35));let G=new n.bdM(1,1);S=new n.BKk({uniforms:{uA:{value:0}},transparent:!0,depthWrite:!1,depthTest:!1,blending:n.EZo,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`
        uniform float uA; varying vec2 vUv;
        void main(){
          float r = length(vUv - 0.5) * 2.0;
          float a = pow(max(1.0 - r, 0.0), 2.6);
          gl_FragColor = vec4(vec3(0.24, 0.26, 0.96) * a * uA, a * uA);
        }`}),(P=new n.eaF(G,S)).scale.set(2500,1900,1),P.position.set(0,0,-260),P.renderOrder=0,y.add(P),b.push(G,S);let ee=new n.bdM(1,1);T=new n.BKk({uniforms:{uA:{value:0},uC:{value:new n.Pq0}},transparent:!0,depthWrite:!1,side:n.$EB,vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
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
          gl_FragColor = vec4(vec3(0.42, 0.45, 1.0) * a, a);
        }`,blending:n.EZo});let et=new n.eaF(ee,T);et.rotation.x=-Math.PI/2,et.scale.set(6e4,6e4,1),et.position.set(W/2,-1120,0),et.renderOrder=0,y.add(et),b.push(ee,T);let ea=new n.j6(r,d?420:900,7,8,!1);z=new n.BKk({uniforms:{uDraw:{value:0},uT:{value:0},uSeg:{value:o.L5.length-1}},transparent:!0,depthWrite:!1,blending:n.EZo,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`
        uniform float uDraw, uT, uSeg; varying vec2 vUv;
        vec3 faixa(float k) {
          if (k < 1.0) return vec3(0.50, 0.82, 0.16);
          if (k < 2.0) return vec3(0.96, 0.26, 0.14);
          if (k < 3.0) return vec3(0.33, 0.78, 0.96);
          if (k < 4.0) return vec3(0.26, 0.42, 0.98);
          if (k < 5.0) return vec3(0.96, 0.20, 0.15);
          if (k < 6.0) return vec3(0.26, 0.76, 0.26);
          return vec3(0.99, 0.82, 0.06);
        }
        void main(){
          float on = step(vUv.x, uDraw);
          float spark = 0.0;
          for (int i = 0; i < 4; i++) {
            float run = fract(uT * 0.03 + float(i) / 4.0) * uDraw;
            spark += exp(-pow((vUv.x - run) * 260.0, 2.0));
          }
          float head = exp(-pow((vUv.x - uDraw) * 150.0, 2.0)) * smoothstep(0.0, 0.02, uDraw);
          float a = on * (0.62 + spark * 0.7) * smoothstep(0.0, 0.01, uDraw) + head * 1.4 * step(vUv.x, uDraw + 0.004);
          vec3 c = mix(faixa(mod(floor(vUv.x * uSeg), 7.0)), vec3(1.0), clamp(head + spark * 0.5, 0.0, 1.0));
          gl_FragColor = vec4(c * a, a);
        }`});let en=new n.eaF(ea,z);en.renderOrder=2,en.frustumCulled=!1,y.add(en),b.push(ea,z)}let E={w:1,h:1,dpr:1},U={x:0,y:0,tx:0,ty:0},I=0,W=0,Z=0,_=!1,D=new n.Pq0,q=new n.Pq0,O=new n.kn4,L=new n.kn4,j=new n.PTz,V=new n.O9p,Q=new n.Pq0,Y=new n.Pq0,H=2e3;function K(){let e=u.clientWidth||window.innerWidth,t=u.clientHeight||window.innerHeight;E.w=e,E.h=t,E.dpr=Math.min(window.devicePixelRatio||1,d?1.25:1.75),M.aspect=e/t,M.updateProjectionMatrix(),g&&(g.setPixelRatio(E.dpr),g.setSize(e,t,!1)),c.style.width=`${e}px`,c.style.height=`${t}px`}function N(e){var t;let a,n,i,l,s,p=Math.min(.05,(e-W)/1e3||0);W=e,Z+=p;let h=1-Math.pow(.0015,p);U.x+=(U.tx-U.x)*h,U.y+=(U.ty-U.y)*h,t=Z,a=+!v,n=(0,o.rc)(f.yaw+1.7*U.x*a+.22*Math.sin(.23*t)*a),i=(0,o.rc)(f.pitch-1.1*U.y*a+.16*Math.sin(.19*t+1.3)*a),l=Math.tan((0,o.rc)(32)/2),H=s=Math.max(f.h/2/(1-2*Math.abs(f.oy)),f.w/2/(M.aspect*(1-2*Math.abs(f.ox))))/l,D.set(f.cx,f.cy,f.cz),q.set(Math.sin(n)*Math.cos(i),Math.sin(i),Math.cos(n)*Math.cos(i)),M.position.copy(D).addScaledVector(q,s),M.up.set(0,1,0),M.lookAt(D),f.roll&&M.rotateZ((0,o.rc)(f.roll)),f.ox&&M.translateX(-(2*f.ox)*s*l*M.aspect),f.oy&&M.translateY(-(2*f.oy)*s*l),M.updateMatrixWorld(!0),function(){let e,t=M.projectionMatrix.elements[5]*(E.h/2);for(let a of(u.style.perspective=`${t.toFixed(2)}px`,c.style.transform=`translateZ(${t.toFixed(2)}px)${e=M.matrixWorldInverse.elements,`matrix3d(${r(e[0])},${r(-e[1])},${r(e[2])},${r(e[3])},${r(e[4])},${r(-e[5])},${r(e[6])},${r(e[7])},${r(e[8])},${r(-e[9])},${r(e[10])},${r(e[11])},${r(e[12])},${r(-e[13])},${r(e[14])},${r(e[15])})`}translate(${E.w/2}px,${E.h/2}px)`,M.getWorldDirection(q),x)){let e=w[a.spec.id];if(e.o<=.003||e.s<=5e-4){a.visible&&(a.el.style.visibility="hidden",a.visible=!1);continue}a.visible||(a.el.style.visibility="visible",a.visible=!0),Q.set(e.x,e.y,e.z);let t=e.s/a.res;Y.set(t,t,t),a.spec.billboard?(O.copy(M.matrixWorldInverse).transpose(),e.rz&&O.multiply(L.makeRotationZ((0,o.rc)(e.rz))),O.setPosition(Q),O.scale(Y),O.elements[3]=O.elements[7]=O.elements[11]=0,O.elements[15]=1):(V.set((0,o.rc)(e.rx),(0,o.rc)(e.ry),(0,o.rc)(e.rz),"YXZ"),j.setFromEuler(V),O.compose(Q,j,Y));let n=function(e){let t=e.elements;return`translate(-50%,-50%) matrix3d(${r(t[0])},${r(t[1])},${r(t[2])},${r(t[3])},${r(-t[4])},${r(-t[5])},${r(-t[6])},${r(-t[7])},${r(t[8])},${r(t[9])},${r(t[10])},${r(t[11])},${r(t[12])},${r(t[13])},${r(t[14])},${r(t[15])})`}(O);n!==a.lastT&&(a.el.style.transform=n,a.lastT=n);let i=e.o>=.997?1:+e.o.toFixed(3);if(i!==a.lastO&&(a.el.style.opacity=1===i?"":String(i),a.lastO=i),a.spec.dof&&!d){let e=Math.round(2*Math.min(12,13*Math.max(0,Math.abs(Q.sub(M.position).dot(q)-H)/Math.max(H,1)-.1)))/2;e!==a.lastB&&(a.el.style.filter=e?`blur(${e}px)`:"",a.lastB=e)}}}(),function(e){if(!g||!k)return;let t=Math.min(Math.max(m.form,0),F.length-1-1e-4),a=Math.floor(t);if(a!==B&&C&&R&&(C.array.set(F[a]),R.array.set(F[a+1]),C.needsUpdate=!0,R.needsUpdate=!0,B=a),k.uT.value=e,k.uMix.value=t-a,k.uTurb.value=m.turb,k.uReveal.value=m.reveal,k.uAlpha.value=m.pAlpha,k.uBokeh.value=m.bokeh,k.uTint.value=m.tint,k.uFocus.value=H,k.uScale.value=M.projectionMatrix.elements[5]*(E.h/2),k.uDpr.value=E.dpr,k.uPulse.value=v?.5:.5+.5*Math.sin(2.4*e),k.uSignal.value=m.signal,A){let e=m.mark>.004;A.visible=e,e&&($.forEach(e=>e.opacity=Math.min(1,m.mark)),A.rotation.set((0,o.rc)(m.markPitch-5*U.y),(0,o.rc)(m.markYaw+8*U.x),0),A.scale.setScalar(m.markScale*(.94+.06*Math.min(1,m.mark))))}S&&P&&(S.uniforms.uA.value=m.glow,P.position.set(m.glowX,m.glowY,-260)),T&&(T.uniforms.uA.value=m.grid,T.uniforms.uC.value.set(f.cx,0,f.cz)),z&&(z.uniforms.uDraw.value=m.rail,z.uniforms.uT.value=e),g.render(y,M)}(Z)}function X(e){_&&(N(e),I=requestAnimationFrame(X))}let J=()=>{document.hidden?(_=!1,cancelAnimationFrame(I)):_||(_=!0,W=performance.now(),I=requestAnimationFrame(X))};return K(),window.addEventListener("resize",K),document.addEventListener("visibilitychange",J),{cam:f,fx:m,objs:w,webgl:!!g,start(){_||(_=!0,W=performance.now(),I=requestAnimationFrame(X))},renderNow(){N(performance.now())},setPointer(e,t){U.tx=e,U.ty=t},resize:K,dispose(){for(let e of(_=!1,cancelAnimationFrame(I),window.removeEventListener("resize",K),document.removeEventListener("visibilitychange",J),b.forEach(e=>e.dispose()),g?.dispose(),x)){e.el.style.cssText="";let t=e.el.firstElementChild;t&&(t.style.cssText="")}}}}}}]);