"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[594],{2594:(e,t,a)=>{a.r(t),a.d(t,{createEngine:()=>u});var l=a(5269),n=a(9625),o=a(786),i=a(9724);let r=e=>1e-6>Math.abs(e)?0:+e.toFixed(5);class s extends l.B6O{getPointAt(e,t){return this.getPoint(e,t)}getTangentAt(e,t){return this.getTangent(e,t)}}function u(e){let t,{canvas:a,persp:u,camEl:c,calm:v,low:d,badge:p}=e,h=(t=0x1306ae3,()=>{t|=0;let e=Math.imul((t=t+0x6d2b79f5|0)^t>>>15,1|t);return(((e=e+Math.imul(e^e>>>7,61|e)^e)^e>>>14)>>>0)/0x100000000}),m={cx:0,cy:0,cz:0,w:1700,h:1e3,yaw:0,pitch:0,roll:0,ox:0,oy:0},f={form:0,turb:0,reveal:0,pAlpha:1,bokeh:1,tint:0,mark:0,markYaw:0,markPitch:0,markScale:1,glow:0,glowX:0,glowY:0,grid:0,rail:0,signal:0},w={},x=[];for(let e of i.fQ){let t=c.querySelector(`[data-obj="${e.id}"]`);if(!t)continue;let a=t.firstElementChild,l=d?Math.min(e.res??1,1.15):e.res??1,n=a.offsetWidth,o=a.offsetHeight;a.style.width=`${n}px`,a.style.height=`${o}px`,a.style.transform=`scale(${l})`,t.style.width=`${n*l}px`,t.style.height=`${o*l}px`,t.dataset.w=String(n),t.dataset.h=String(o),w[e.id]={x:e.pos[0],y:e.pos[1],z:e.pos[2],rx:e.rot?.[0]??0,ry:e.rot?.[1]??0,rz:e.rot?.[2]??0,s:e.scale??1,o:0},t.style.visibility="hidden",x.push({spec:e,el:t,res:l,visible:!1,lastT:"",lastO:-1,lastB:-1})}let g=null;try{g=new n.JeP({canvas:a,antialias:!d,alpha:!0,powerPreference:"high-performance"})}catch{g=null}let y=new l.Z58,M=new l.ubm(32,1,20,6e4),b=[],A=null,$=null,P=[],T=null,S=null,z=null,k=null,F=[],C=null,R=null,B=-1;if(g){g.setClearColor(0,0),g.toneMapping=l.FV,g.toneMappingExposure=1.05,g.outputColorSpace=l.er$;let e=d?6e3:2e4,t=(0,o.Or)(430),a=(0,o.Cu)(430),r=new s(i.L5.map(e=>new l.Pq0(...e)),!1,"catmullrom",.5),u=new Float32Array(3*e),c=new Float32Array(3*e),v=new Float32Array(3*e),m=new Float32Array(3*e),f=new Float32Array(3*e),w=new Float32Array(3*e),x=new Float32Array(4*e),M=()=>{let e=0,t=0;for(;0===e;)e=h();for(;0===t;)t=h();return Math.sqrt(-2*Math.log(e))*Math.cos(2*Math.PI*t)},B=[];if(p){let e=p.data;for(let t=0;t<p.w*p.h;t++)e[4*t+3]>150&&!(e[4*t]>236&&e[4*t+1]>236&&e[4*t+2]>236)&&B.push(t)}let E=p?i.yq.h/p.h:1,U=new l.Pq0,I=i.UZ[i.UZ.length-1].pos,W=i.Kp[0]+2600;for(let l=0;l<e;l++){let e=3*l;if(0===l)u[0]=u[1]=u[2]=0;else{let t=260+2400*Math.pow(h(),.6),a=h()*Math.PI*2;u[e]=Math.cos(a)*t*1.25,u[e+1]=Math.sin(a)*t*.7,u[e+2]=-1900+2500*h()}if(.76>h()){let l=0,n=0;for(let e=0;e<40&&(l=(h()-.5)*a,n=(h()-.5)*430,!(0,o.s3)(l,n,t));e++);c[e]=l,c[e+1]=n,c[e+2]=(h()-.5)*46}else{let t=420+1500*h(),a=h()*Math.PI*2;c[e]=Math.cos(a)*t*1.3,c[e+1]=Math.sin(a)*t*.72,c[e+2]=-1500+1500*h()}let n=h();if(n<.5){let t=i.UZ[Math.floor(h()*i.UZ.length)].pos,a=190+230*h();v[e]=t[0]+M()*a,v[e+1]=t[1]+M()*a*.8,v[e+2]=t[2]-120+M()*a}else n<.78?(r.getPoint(h(),U),v[e]=U.x+70*M(),v[e+1]=U.y+46*M(),v[e+2]=U.z+70*M()):(v[e]=-1200+h()*(I[0]+3600),v[e+1]=(h()-.5)*3600,v[e+2]=-2600+3e3*h());let s=.05>h(),d=-2600+h()*(W+2600);m[e]=d,m[e+1]=d/W*900-300+(h()-.5)*3400,m[e+2]=s?500+1e3*h():-3200+2700*h();let g=.36,y=.78,b=1;if(B.length&&.82>h()){let t=B[Math.floor(h()*B.length)],a=t%p.w,l=Math.floor(t/p.w);f[e]=i.Iz[0]+(a-p.w/2+h()-.5)*E,f[e+1]=i.Iz[1]+(p.h/2-l+h()-.5)*E,f[e+2]=i.Iz[2]+(h()-.5)*34,g=p.data[4*t]/255;let n=Math.min(2.2,.92/Math.max(g,y=p.data[4*t+1]/255,b=p.data[4*t+2]/255,.05));n>1&&(g*=n,y*=n,b*=n)}else{let t=520+1700*h(),a=h()*Math.PI*2;f[e]=i.Iz[0]+Math.cos(a)*t*1.3,f[e+1]=i.Iz[1]+Math.sin(a)*t*.72,f[e+2]=i.Iz[2]-1500+1500*h()}w[e]=g,w[e+1]=y,w[e+2]=b,x[4*l]=0===l?0:h(),x[4*l+1]=h(),x[4*l+2]=h(),x[4*l+3]=h()}F.push(u,c,v,m,f);let Z=new l.LoY;C=new l.THS(new Float32Array(u),3),R=new l.THS(new Float32Array(c),3),C.setUsage(l.Vnu),R.setUsage(l.Vnu),Z.setAttribute("position",C),Z.setAttribute("aB",R),Z.setAttribute("aRnd",new l.THS(x,4)),Z.setAttribute("aCol",new l.THS(w,3)),Z.boundingSphere=new l.iyt(new l.Pq0,1e6),A={uT:{value:0},uMix:{value:0},uTurb:{value:0},uReveal:{value:0},uAlpha:{value:1},uBokeh:{value:1},uTint:{value:0},uFocus:{value:2e3},uScale:{value:1500},uDpr:{value:1},uPulse:{value:0},uSignal:{value:0}};let _=new l.BKk({uniforms:A,transparent:!0,depthWrite:!1,blending:l.EZo,vertexShader:`
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
        }`,fragmentShader:`
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
        }`}),D=new l.ONl(Z,_);D.renderOrder=3,D.frustumCulled=!1,y.add(D),b.push(Z,_);let q=new l.Z58,O=(e,t,a,n,o=[0,0,0])=>{let i=new l.bdM(e,t),r=new l.V9B({color:a,side:l.$EB}),s=new l.eaF(i,r);s.position.set(...n),s.lookAt(...o),q.add(s),b.push(i,r)};q.background=new l.Q1f(200735);let j=new l.Gu$(40,32,16),L=new l.BKk({side:l.hsX,vertexShader:"varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`
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
        }`});q.add(new l.eaF(j,L)),b.push(j,L),O(14,5,new l.Q1f(7,7.6,8.5),[0,9,3]),O(3,12,new l.Q1f(1.4,4.6,9),[-10,1,2]),O(2.2,10,new l.Q1f(5,6.4,9),[10,2,-2]),O(8,1.2,new l.Q1f(.8,2.8,6),[0,-8,4]),O(5,5,new l.Q1f(1,1.6,2.4),[0,0,12]);let V=new n.BdL(g),Q=V.fromScene(q,.035);y.environment=Q.texture,b.push(Q,V);let Y=new l.ypk;t.forEach(([e,t],a)=>a?Y.lineTo(e,t):Y.moveTo(e,t)),Y.closePath();let H=new l.QCA(Y,{depth:96,bevelEnabled:!0,bevelThickness:12,bevelSize:10,bevelOffset:-10,bevelSegments:d?3:7,curveSegments:12});H.translate(0,0,-48);let K=new l.uSd({color:37084,metalness:.5,roughness:.3,clearcoat:1,clearcoatRoughness:.1,envMapIntensity:.75,emissive:24500,emissiveIntensity:.5,transparent:!0,opacity:0}),N=new l.uSd({color:6080767,metalness:.6,roughness:.2,clearcoat:1,clearcoatRoughness:.06,envMapIntensity:1.25,emissive:695264,emissiveIntensity:.3,transparent:!0,opacity:0});P=[K,N],($=new l.YJl).add(new l.eaF(H,P)),$.renderOrder=1,$.visible=!1,y.add($),b.push(H,K,N);let X=new l.ZyN(0xffffff,2.4);X.position.set(-700,900,1300);let J=new l.ZyN(0x9ddcff,1.6);J.position.set(900,-200,-700),y.add(X,J,new l.$p8(2795775,.35));let G=new l.bdM(1,1);S=new l.BKk({uniforms:{uA:{value:0}},transparent:!0,depthWrite:!1,depthTest:!1,blending:l.EZo,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`
        uniform float uA; varying vec2 vUv;
        void main(){
          float r = length(vUv - 0.5) * 2.0;
          float a = pow(max(1.0 - r, 0.0), 2.6);
          gl_FragColor = vec4(vec3(0.0, 0.46, 0.92) * a * uA, a * uA);
        }`}),(T=new l.eaF(G,S)).scale.set(2500,1900,1),T.position.set(0,0,-260),T.renderOrder=0,y.add(T),b.push(G,S);let ee=new l.bdM(1,1);z=new l.BKk({uniforms:{uA:{value:0},uC:{value:new l.Pq0}},transparent:!0,depthWrite:!1,side:l.$EB,vertexShader:"varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }",fragmentShader:`
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
        }`,blending:l.EZo});let et=new l.eaF(ee,z);et.rotation.x=-Math.PI/2,et.scale.set(6e4,6e4,1),et.position.set(W/2,-1120,0),et.renderOrder=0,y.add(et),b.push(ee,z);let ea=new l.j6(r,d?420:900,7,8,!1);k=new l.BKk({uniforms:{uDraw:{value:0},uT:{value:0}},transparent:!0,depthWrite:!1,blending:l.EZo,vertexShader:"varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",fragmentShader:`
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
        }`});let el=new l.eaF(ea,k);el.renderOrder=2,el.frustumCulled=!1,y.add(el),b.push(ea,k)}let E={w:1,h:1,dpr:1},U={x:0,y:0,tx:0,ty:0},I=0,W=0,Z=0,_=!1,D=new l.Pq0,q=new l.Pq0,O=new l.kn4,j=new l.kn4,L=new l.PTz,V=new l.O9p,Q=new l.Pq0,Y=new l.Pq0,H=2e3;function K(){let e=u.clientWidth||window.innerWidth,t=u.clientHeight||window.innerHeight;E.w=e,E.h=t,E.dpr=Math.min(window.devicePixelRatio||1,d?1.25:1.75),M.aspect=e/t,M.updateProjectionMatrix(),g&&(g.setPixelRatio(E.dpr),g.setSize(e,t,!1)),c.style.width=`${e}px`,c.style.height=`${t}px`}function N(e){var t;let a,l,n,o,s,p=Math.min(.05,(e-W)/1e3||0);W=e,Z+=p;let h=1-Math.pow(.0015,p);U.x+=(U.tx-U.x)*h,U.y+=(U.ty-U.y)*h,t=Z,a=+!v,l=(0,i.rc)(m.yaw+1.7*U.x*a+.22*Math.sin(.23*t)*a),n=(0,i.rc)(m.pitch-1.1*U.y*a+.16*Math.sin(.19*t+1.3)*a),o=Math.tan((0,i.rc)(32)/2),H=s=Math.max(m.h/2/(1-2*Math.abs(m.oy)),m.w/2/(M.aspect*(1-2*Math.abs(m.ox))))/o,D.set(m.cx,m.cy,m.cz),q.set(Math.sin(l)*Math.cos(n),Math.sin(n),Math.cos(l)*Math.cos(n)),M.position.copy(D).addScaledVector(q,s),M.up.set(0,1,0),M.lookAt(D),m.roll&&M.rotateZ((0,i.rc)(m.roll)),m.ox&&M.translateX(-(2*m.ox)*s*o*M.aspect),m.oy&&M.translateY(-(2*m.oy)*s*o),M.updateMatrixWorld(!0),function(){let e,t=M.projectionMatrix.elements[5]*(E.h/2);for(let a of(u.style.perspective=`${t.toFixed(2)}px`,c.style.transform=`translateZ(${t.toFixed(2)}px)${e=M.matrixWorldInverse.elements,`matrix3d(${r(e[0])},${r(-e[1])},${r(e[2])},${r(e[3])},${r(e[4])},${r(-e[5])},${r(e[6])},${r(e[7])},${r(e[8])},${r(-e[9])},${r(e[10])},${r(e[11])},${r(e[12])},${r(-e[13])},${r(e[14])},${r(e[15])})`}translate(${E.w/2}px,${E.h/2}px)`,M.getWorldDirection(q),x)){let e=w[a.spec.id];if(e.o<=.003||e.s<=5e-4){a.visible&&(a.el.style.visibility="hidden",a.visible=!1);continue}a.visible||(a.el.style.visibility="visible",a.visible=!0),Q.set(e.x,e.y,e.z);let t=e.s/a.res;Y.set(t,t,t),a.spec.billboard?(O.copy(M.matrixWorldInverse).transpose(),e.rz&&O.multiply(j.makeRotationZ((0,i.rc)(e.rz))),O.setPosition(Q),O.scale(Y),O.elements[3]=O.elements[7]=O.elements[11]=0,O.elements[15]=1):(V.set((0,i.rc)(e.rx),(0,i.rc)(e.ry),(0,i.rc)(e.rz),"YXZ"),L.setFromEuler(V),O.compose(Q,L,Y));let l=function(e){let t=e.elements;return`translate(-50%,-50%) matrix3d(${r(t[0])},${r(t[1])},${r(t[2])},${r(t[3])},${r(-t[4])},${r(-t[5])},${r(-t[6])},${r(-t[7])},${r(t[8])},${r(t[9])},${r(t[10])},${r(t[11])},${r(t[12])},${r(t[13])},${r(t[14])},${r(t[15])})`}(O);l!==a.lastT&&(a.el.style.transform=l,a.lastT=l);let n=e.o>=.997?1:+e.o.toFixed(3);if(n!==a.lastO&&(a.el.style.opacity=1===n?"":String(n),a.lastO=n),a.spec.dof&&!d){let e=Math.round(2*Math.min(12,13*Math.max(0,Math.abs(Q.sub(M.position).dot(q)-H)/Math.max(H,1)-.1)))/2;e!==a.lastB&&(a.el.style.filter=e?`blur(${e}px)`:"",a.lastB=e)}}}(),function(e){if(!g||!A)return;let t=Math.min(Math.max(f.form,0),F.length-1-1e-4),a=Math.floor(t);if(a!==B&&C&&R&&(C.array.set(F[a]),R.array.set(F[a+1]),C.needsUpdate=!0,R.needsUpdate=!0,B=a),A.uT.value=e,A.uMix.value=t-a,A.uTurb.value=f.turb,A.uReveal.value=f.reveal,A.uAlpha.value=f.pAlpha,A.uBokeh.value=f.bokeh,A.uTint.value=f.tint,A.uFocus.value=H,A.uScale.value=M.projectionMatrix.elements[5]*(E.h/2),A.uDpr.value=E.dpr,A.uPulse.value=v?.5:.5+.5*Math.sin(2.4*e),A.uSignal.value=f.signal,$){let e=f.mark>.004;$.visible=e,e&&(P.forEach(e=>e.opacity=Math.min(1,f.mark)),$.rotation.set((0,i.rc)(f.markPitch-5*U.y),(0,i.rc)(f.markYaw+8*U.x),0),$.scale.setScalar(f.markScale*(.94+.06*Math.min(1,f.mark))))}S&&T&&(S.uniforms.uA.value=f.glow,T.position.set(f.glowX,f.glowY,-260)),z&&(z.uniforms.uA.value=f.grid,z.uniforms.uC.value.set(m.cx,0,m.cz)),k&&(k.uniforms.uDraw.value=f.rail,k.uniforms.uT.value=e),g.render(y,M)}(Z)}function X(e){_&&(N(e),I=requestAnimationFrame(X))}let J=()=>{document.hidden?(_=!1,cancelAnimationFrame(I)):_||(_=!0,W=performance.now(),I=requestAnimationFrame(X))};return K(),window.addEventListener("resize",K),document.addEventListener("visibilitychange",J),{cam:m,fx:f,objs:w,webgl:!!g,start(){_||(_=!0,W=performance.now(),I=requestAnimationFrame(X))},renderNow(){N(performance.now())},setPointer(e,t){U.tx=e,U.ty=t},resize:K,dispose(){for(let e of(_=!1,cancelAnimationFrame(I),window.removeEventListener("resize",K),document.removeEventListener("visibilitychange",J),b.forEach(e=>e.dispose()),g?.dispose(),x)){e.el.style.cssText="";let t=e.el.firstElementChild;t&&(t.style.cssText="")}}}}}}]);