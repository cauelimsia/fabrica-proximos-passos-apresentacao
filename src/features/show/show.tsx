'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MessageCircle, Pause, Play, RotateCcw } from 'lucide-react';
import './show.css';
import { CHAPTERS, CONTACT, DECISIONS, STEP_LIST, type ChapterId } from './data';
import { COPY } from './copy';
import { MARK_PATH, MARK_VIEWBOX } from './engine/shapes';
import { STEPS } from './engine/world';
import type { BadgePixels } from './engine/engine';
import { TIMES, TOTAL, buildTimeline } from './timeline';
import { DecisionCard, StationApprove, StationBuild, StationKick, StationLive, StationMaterial, StationReport, StepLabel } from './ui/panels';
import recanto from './assets/recanto.png';
import emblema from './assets/recanto-emblema.png';
import four from './assets/four-mkt.png';

/** px de rolagem por segundo de filme */
const PX_PER_SECOND = 104;
const STATION_UI = [StationKick, StationMaterial, StationBuild, StationApprove, StationLive, StationReport];

function Obj({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <div className="sc-obj" data-obj={id}>
      <div>{children}</div>
    </div>
  );
}

function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((w, i) => (
        <span key={i}>
          <span className="sc-w">
            <span>{w}</span>
          </span>{' '}
        </span>
      ))}
    </>
  );
}

function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox={MARK_VIEWBOX} className={className} aria-hidden="true">
      <path d={MARK_PATH} fill="#2cb8f5" />
    </svg>
  );
}

/** lê os pixels da logo (reduzida): as partículas do fecho nascem deles */
async function readBadge(src: string): Promise<BadgePixels | null> {
  try {
    const img = new Image();
    img.src = src;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = 800;
    c.height = Math.round((800 * img.naturalHeight) / img.naturalWidth);
    const g = c.getContext('2d', { willReadFrequently: true });
    if (!g) return null;
    g.drawImage(img, 0, 0, c.width, c.height);
    return { data: g.getImageData(0, 0, c.width, c.height).data, w: c.width, h: c.height };
  } catch {
    return null;
  }
}

export function Show() {
  const rootRef = useRef<HTMLDivElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const perspRef = useRef<HTMLDivElement>(null);
  const camRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLElement>(null);
  const api = useRef<{ toggle(): void; goTo(id: ChapterId): void; restart(): void } | null>(null);

  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [chapter, setChapter] = useState<ChapterId>('fechado');

  useEffect(() => {
    const root = rootRef.current!;
    const spacer = spacerRef.current!;
    const camEl = camRef.current!;
    let killed = false;
    let cleanup = () => {};

    const calm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    const low = coarse || (navigator.hardwareConcurrency ?? 8) <= 4 || window.innerWidth < 820;
    const mqTall = window.matchMedia('(max-aspect-ratio: 1/1)');

    (async () => {
      const [{ createEngine }, { gsap }, { ScrollTrigger }] = await Promise.all([import('./engine/engine'), import('gsap'), import('gsap/ScrollTrigger')]);
      const imgs = Array.from(root.querySelectorAll('img'));
      const [badge] = await Promise.all([readBadge(recanto.src), document.fonts?.ready, ...imgs.map((img) => (img.complete ? null : img.decode().catch(() => null)))]);
      if (killed) return;

      gsap.registerPlugin(ScrollTrigger);
      const engine = createEngine({ canvas: canvasRef.current!, persp: perspRef.current!, camEl, calm, low, badge });

      const scroller = { y: window.scrollY };
      let auto: gsap.core.Tween | null = null;
      let jump: gsap.core.Tween | null = null;
      let st: ScrollTrigger | null = null;
      let tl: gsap.core.Timeline | null = null;
      let current: ChapterId = 'fechado';
      const maxScroll = () => document.documentElement.scrollHeight - window.innerHeight;
      const ids = CHAPTERS.map((c) => c.id);

      const onProgress = (time: number, progress: number) => {
        if (barRef.current) barRef.current.style.transform = `scaleX(${progress.toFixed(4)})`;
        let id: ChapterId = 'fechado';
        for (const c of ids) if (time >= TIMES[c] - 0.05) id = c;
        if (id !== current) {
          current = id;
          setChapter(id);
        }
      };

      const ctx = gsap.context(() => {
        tl = buildTimeline({ gsap, root, engine, tall: mqTall.matches });
        st = ScrollTrigger.create({
          trigger: spacer,
          start: 'top top',
          end: 'bottom bottom',
          scrub: calm ? true : 0.9,
          animation: tl,
          onUpdate: (self) => onProgress(tl!.time(), self.progress),
        });
      }, root);

      const stop = () => {
        auto?.kill();
        auto = null;
        setPlaying(false);
      };
      const play = () => {
        jump?.kill();
        if ((st?.progress ?? 0) > 0.992) window.scrollTo(0, 0);
        scroller.y = window.scrollY;
        const remaining = TOTAL * (1 - scroller.y / Math.max(1, maxScroll()));
        auto = gsap.to(scroller, {
          y: maxScroll(),
          duration: remaining,
          ease: 'none',
          onUpdate: () => window.scrollTo(0, scroller.y),
          onComplete: stop,
        });
        setPlaying(true);
      };
      const goTime = (time: number, duration = 1.3) => {
        stop();
        scroller.y = window.scrollY;
        jump?.kill();
        jump = gsap.to(scroller, {
          y: (Math.min(time, TOTAL) / TOTAL) * maxScroll(),
          duration,
          ease: 'power2.inOut',
          onUpdate: () => window.scrollTo(0, scroller.y),
        });
      };
      /** entra no capítulo já com a cena formada, não no meio da transição */
      const LEAD_IN: Partial<Record<ChapterId, number>> = { fechado: 0, caminho: 3.4, decisoes: 3.2, fecho: 6.4 };
      const goTo = (id: ChapterId) => goTime(TIMES[id] + (LEAD_IN[id] ?? 2.6));

      api.current = {
        toggle: () => (auto ? stop() : play()),
        goTo,
        restart: () => {
          stop();
          window.scrollTo(0, 0);
          play();
        },
      };

      const userScroll = () => {
        if (auto) stop();
      };
      const onKey = (e: KeyboardEvent) => {
        const el = e.target as HTMLElement;
        if (el.closest('input, textarea, select')) return;
        const i = ids.indexOf(current);
        if (e.key === ' ' || e.key === 'k') {
          if (el.closest('button, a')) return;
          e.preventDefault();
          api.current?.toggle();
        } else if (e.key === 'ArrowRight' || e.key === 'PageDown') {
          e.preventDefault();
          goTo(ids[Math.min(ids.length - 1, i + 1)]);
        } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
          e.preventDefault();
          goTo(ids[Math.max(0, i - 1)]);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Home' || e.key === 'End') {
          userScroll();
        }
      };
      const onPointer = (e: PointerEvent) => {
        if (e.pointerType === 'touch') return;
        engine.setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
      };
      const onTall = () => window.location.reload();

      window.addEventListener('wheel', userScroll, { passive: true });
      window.addEventListener('touchstart', userScroll, { passive: true });
      window.addEventListener('keydown', onKey);
      window.addEventListener('pointermove', onPointer, { passive: true });
      mqTall.addEventListener('change', onTall);

      ScrollTrigger.refresh();
      onProgress(tl!.time(), st!.progress);
      engine.renderNow();
      engine.start();
      setReady(true);

      // conferência: ?t=42 abre parado no segundo 42 do filme
      const seek = (time: number) => {
        stop();
        window.scrollTo(0, (time / TOTAL) * maxScroll());
        tl!.time(time);
        onProgress(time, time / TOTAL);
        engine.renderNow();
      };
      (window as unknown as Record<string, unknown>).__sc = { engine, TIMES, TOTAL, seek };
      const at = new URLSearchParams(window.location.search).get('t');
      if (at !== null && !Number.isNaN(+at)) seek(+at);

      cleanup = () => {
        stop();
        jump?.kill();
        window.removeEventListener('wheel', userScroll);
        window.removeEventListener('touchstart', userScroll);
        window.removeEventListener('keydown', onKey);
        window.removeEventListener('pointermove', onPointer);
        mqTall.removeEventListener('change', onTall);
        ctx.revert();
        engine.dispose();
        api.current = null;
      };
    })();

    return () => {
      killed = true;
      cleanup();
    };
  }, []);

  const toggle = useCallback(() => api.current?.toggle(), []);

  return (
    <div className="sc-page">
      <div ref={spacerRef} aria-hidden="true" style={{ height: `calc(${Math.round(TOTAL * PX_PER_SECOND)}px + 100vh)` }} />

      <div ref={rootRef} className="sc-root">
        <div className="sc-atmo" />
        <canvas ref={canvasRef} className="sc-canvas" aria-hidden="true" />

        <div className="sc-view" aria-hidden="true">
          <div ref={perspRef} className="sc-persp">
            <div ref={camRef} className="sc-cam">
              {STATION_UI.map((Ui, i) => (
                <Obj key={i} id={`s${i + 1}`}>
                  <Ui />
                </Obj>
              ))}
              {Array.from({ length: STEPS }, (_, i) => (
                <Obj key={i} id={`lb${i + 1}`}>
                  <StepLabel i={i} />
                </Obj>
              ))}
              {DECISIONS.map((_, i) => (
                <Obj key={i} id={`d${i + 1}`}>
                  <DecisionCard i={i} />
                </Obj>
              ))}
              <Obj id="badge">
                <div className="sc-badge">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={recanto.src} alt="" width={960} height={464} draggable={false} />
                </div>
              </Obj>
            </div>
          </div>
        </div>

        <div className="sc-vignette" />
        <div className="sc-scrim" />
        <div className="sc-scrim-side" />

        <div className="sc-hud">
          <div className="sc-ping" />
          <Mark className="sc-mark-fallback" />

          {COPY.map((c) => (
            <div key={c.id} data-copy={c.id} className={`sc-copy ${c.pos === 'center' ? 'sc-copy--center' : c.pos === 'big' ? '' : 'sc-copy--side'}`}>
              <h2>
                <Words text={c.h} />
              </h2>
              {c.p ? <p>{c.p}</p> : null}
            </div>
          ))}

          <div className="sc-lockup" data-lockup="open">
            <span className="sc-kicker">Recanto da Criança</span>
            <h1>
              <Words text="Próximos" />
              <span className="sc-w">
                <span>
                  <em>passos</em>
                </span>
              </span>
            </h1>
            <p>Como a Fábrica de Matrículas entra no ar na escola.</p>
          </div>

          <div className="sc-lockup" data-lockup="close">
            <h2>
              <Words text="Vamos" />
              <span className="sc-w">
                <span>
                  <em>começar.</em>
                </span>
              </span>
            </h2>
            <p>Recanto da Criança e Fábrica de Matrículas, no mesmo WhatsApp.</p>
            <div className="sc-cta">
              <a href={CONTACT.href} target="_blank" rel="noopener noreferrer" className="sc-btn sc-btn--solid sc-btn--lg">
                <MessageCircle /> Falar com a equipe · {CONTACT.label}
              </a>
              <button type="button" className="sc-btn sc-btn--lg" onClick={() => api.current?.restart()}>
                <RotateCcw /> Rever do início
              </button>
            </div>
            <div className="sc-team">
              <span>Quem cuida do projeto</span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={four.src} alt="Four MKT 360°" width={116} height={50} />
            </div>
          </div>

          <header className="sc-top">
            <span className="sc-brand">
              <span className="sc-brand-chip">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={emblema.src} alt="Recanto Interativo" width={59} height={32} />
              </span>
              <span>
                Fábrica de Matrículas <small>· próximos passos</small>
              </span>
            </span>
            <div className="sc-actions">
              <button type="button" className="sc-btn" onClick={toggle} aria-pressed={playing}>
                {playing ? <Pause /> : <Play />}
                {playing ? 'Pausar' : 'Assistir'}
              </button>
            </div>
          </header>

          <nav className="sc-rail" aria-label="Capítulos">
            {CHAPTERS.map((c) => (
              <button key={c.id} type="button" aria-current={chapter === c.id} onClick={() => api.current?.goTo(c.id)}>
                <span>{c.name}</span>
                <i />
              </button>
            ))}
          </nav>

          <div className="sc-foot">
            <span className="sc-hint">
              Role para avançar, ou <kbd>espaço</kbd> para assistir
            </span>
            <span>Telas e números de exemplo</span>
          </div>
          <div className="sc-progress">
            <i ref={barRef} />
          </div>
        </div>

        <div className="sc-loader" data-done={ready}>
          <Mark />
        </div>

        <div className="sc-sr">
          <h1>Próximos passos da Fábrica de Matrículas no Recanto da Criança</h1>
          <ol>
            {STEP_LIST.map((s) => (
              <li key={s.n}>
                {s.title} ({s.week}, {s.who})
              </li>
            ))}
          </ol>
          {COPY.map((c) => (
            <p key={c.id}>
              {c.h} {c.p}
            </p>
          ))}
          {DECISIONS.map((d) => (
            <p key={d.n}>
              {d.title}: {d.note}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
