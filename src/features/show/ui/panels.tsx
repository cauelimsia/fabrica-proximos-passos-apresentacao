import {
  BadgeCheck,
  CalendarDays,
  Check,
  FileSignature,
  FileSpreadsheet,
  LayoutGrid,
  MessagesSquare,
  Mic,
  ShieldOff,
  ThumbsUp,
  UserRound,
  Users,
} from 'lucide-react';
import { AGENDA, CHAT, CLASSES, DECISIONS, FAMILY, FUNNEL, MATERIAL, MODULES, PACKAGE, REPORT, REVIEW, ROOM, RULES, STEP_LIST } from '../data';

function Head({ i }: { i: number }) {
  const s = STEP_LIST[i];
  return (
    <>
      <div className="st-cover" data-a="cover">
        <i>{s.week}</i>
        <b>{s.n}</b>
        <span>{s.short}</span>
      </div>
      <header className="st-head" data-a="head">
        <span className="st-n">{s.n}</span>
        <h3>{s.title}</h3>
        <span className="st-chip st-chip--week">{s.week}</span>
        <span className="st-chip">{s.who}</span>
      </header>
    </>
  );
}

function Tick() {
  return (
    <span className="st-tick">
      <Check data-a="tick" strokeWidth={3.2} />
    </span>
  );
}

/** 01 · reunião de início */
export function StationKick() {
  return (
    <section className="st">
      <Head i={0} />
      <div className="st-body">
        <div className="st-col" data-col="a">
          <div className="st-card" data-a="card">
            <p className="st-label">Pauta · 1 hora</p>
            <ul className="st-list">
              {AGENDA.map((item) => (
                <li key={item} data-a="row">
                  <Tick />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="st-col" data-col="b">
          <div className="st-card" data-a="card">
            <p className="st-label">Na sala</p>
            <div className="st-seats">
              {ROOM.map((who) => (
                <span key={who} className="st-seat" data-a="seat">
                  <UserRound /> {who}
                </span>
              ))}
            </div>
          </div>
          <div className="st-card st-rec" data-a="card">
            <div className="st-rec-top">
              <span className="st-rec-dot" data-a="rec-dot" />
              <b>Gravando</b>
              <Mic />
              <span className="st-timer" data-a="timer">
                00:00
              </span>
            </div>
            <div className="st-wave" aria-hidden="true">
              {Array.from({ length: 34 }, (_, k) => (
                <i key={k} data-a="bar" style={{ height: `${22 + ((k * 37) % 61)}%` }} />
              ))}
            </div>
            <p className="st-fine">Com autorização. Depois de revisada, a conversa vira texto para a base do atendente.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

const MATERIAL_ICON: Record<string, React.ReactNode> = {
  valores: <FileSpreadsheet />,
  turmas: <Users />,
  contrato: <FileSignature />,
  calendario: <CalendarDays />,
  conversas: <MessagesSquare />,
};

/** 02 · o que a escola envia */
export function StationMaterial() {
  const order = ['valores', 'turmas', 'contrato', 'calendario', 'conversas'];
  return (
    <section className="st">
      <Head i={1} />
      <div className="st-body st-body--docs">
        {order.map((id) => {
          const m = MATERIAL.find((x) => x.id === id)!;
          return (
            <article key={id} className="st-doc" data-a="doc">
              <span className="st-doc-ic">{MATERIAL_ICON[id]}</span>
              <div>
                <b>{m.title}</b>
                <p>{m.note}</p>
              </div>
              <span className="st-stamp" data-a="stamp">
                Recebido
              </span>
            </article>
          );
        })}
        <article className="st-doc st-doc--out" data-a="out">
          <span className="st-doc-ic">
            <ShieldOff />
          </span>
          <div>
            <b>Fica de fora</b>
            <p>Ficha de aluno, dado de saúde e contrato assinado não entram na base</p>
          </div>
        </article>
      </div>
    </section>
  );
}

/** 03 · montagem do sistema */
export function StationBuild() {
  return (
    <section className="st">
      <Head i={2} />
      <div className="st-body">
        <div className="st-col" data-col="a">
          <div className="st-card" data-a="card">
            <p className="st-label">
              Turmas e vagas <em>tela de exemplo</em>
            </p>
            <div className="st-table">
              {CLASSES.map((c) => (
                <div key={c.name} className="st-tr" data-a="row">
                  <div>
                    <b>{c.name}</b>
                    <span>{c.shifts}</span>
                  </div>
                  <span className="st-pill" data-a="pill">
                    <Check strokeWidth={3} /> Vagas
                  </span>
                  <span className="st-pill" data-a="pill">
                    <Check strokeWidth={3} /> Valores
                  </span>
                </div>
              ))}
            </div>
            <p className="st-fine">Turmas, vagas e valores entram do material que o Recanto enviar.</p>
          </div>
        </div>
        <div className="st-col" data-col="b">
          <div className="st-card" data-a="card">
            <p className="st-label">
              <LayoutGrid /> Módulos ligados
            </p>
            <div className="st-mods">
              {MODULES.map((m) => (
                <span key={m} className="st-mod" data-a="mod">
                  <i /> {m}
                </span>
              ))}
            </div>
          </div>
          <div className="st-card st-card--ink" data-a="card">
            <p className="st-label">Regras do atendente</p>
            <ul className="st-rules">
              {RULES.map((r) => (
                <li key={r} data-a="rule">
                  {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 04 · aprovação da escola */
export function StationApprove() {
  return (
    <section className="st">
      <Head i={3} />
      <div className="st-body">
        <div className="st-col" data-col="a">
          <div className="st-card" data-a="card">
            <p className="st-label">Revisão da coordenação</p>
            <ul className="st-review">
              {REVIEW.map((r) => (
                <li key={r} data-a="row">
                  <span>{r}</span>
                  <span className="st-ok" data-a="ok">
                    Aprovado
                  </span>
                  <span className="st-sw" data-a="sw">
                    <i data-a="knob" />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="st-col" data-col="b">
          <div className="st-card st-test" data-a="card">
            <p className="st-label">Teste antes de ligar</p>
            <div className="st-bubble st-bubble--in" data-a="q">
              Qual o valor do integral no maternal?
            </div>
            <div className="st-bubble st-bubble--out" data-a="ans">
              <i />
              <i />
              <span>Responde com o valor da tabela que a coordenação aprovou</span>
            </div>
            <div className="st-verdict" data-a="verdict">
              <span className="st-btn st-btn--yes" data-a="yes">
                <ThumbsUp /> Resposta certa
              </span>
              <span className="st-btn">Ajustar</span>
            </div>
          </div>
          <div className="st-seal" data-a="seal">
            <BadgeCheck />
            <span>
              Liberado
              <br />
              pela escola
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 05 · entrada no ar, acompanhada */
export function StationLive() {
  return (
    <section className="st">
      <Head i={4} />
      <div className="st-body">
        <div className="st-col" data-col="a">
          <div className="st-card st-chat" data-a="card">
            <div className="st-chat-top">
              <span className="st-avatar">RC</span>
              <div>
                <b>Recanto da Criança</b>
                <span>
                  <i /> atendente no ar
                </span>
              </div>
              <em>conversa de exemplo</em>
            </div>
            <div className="st-chat-body">
              {CHAT.map((m) =>
                m.from === 'sys' ? (
                  <div key={m.id} className="st-sys" data-a="msg" data-msg={m.id}>
                    <Users /> {m.text}
                  </div>
                ) : (
                  <div key={m.id} className={`st-msg st-msg--${m.from}`} data-a="msg" data-msg={m.id}>
                    {m.text}
                    <time>{m.time}</time>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>
        <div className="st-col" data-col="b">
          <div className="st-card" data-a="card">
            <p className="st-label">Funil de matrículas</p>
            <ol className="st-funnel">
              {FUNNEL.map((f, k) => (
                <li key={f} data-a="stage" data-stage={k}>
                  <span>{f}</span>
                </li>
              ))}
              <li className="st-lead" data-a="lead" aria-hidden="true">
                <b>{FAMILY.name}</b>
                <span>{FAMILY.about}</span>
              </li>
            </ol>
          </div>
          <div className="st-card st-handoff" data-a="handoff">
            <p className="st-label">Aviso para a secretaria</p>
            <p>
              <b>{FAMILY.name}</b> perguntou sobre desconto para irmão. Responder amanhã cedo.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/** 06 · relatório semanal + pacote completo */
export function StationReport() {
  const top = REPORT.stages[0].value;
  return (
    <section className="st">
      <Head i={5} />
      <div className="st-body">
        <div className="st-col" data-col="a">
          <div className="st-kpis">
            {REPORT.kpis.map((k) => (
              <div key={k.label} className="st-kpi" data-a="kpi">
                <b data-count={k.value}>0</b>
                <span>{k.label}</span>
              </div>
            ))}
          </div>
          <div className="st-card" data-a="card">
            <p className="st-label">
              Onde os pais param <em>números de exemplo</em>
            </p>
            <div className="st-bars">
              {REPORT.stages.map((s) => (
                <div key={s.label} className="st-bar" data-a="stage">
                  <span>{s.label}</span>
                  <i>
                    <u data-a="fill" style={{ width: `${Math.max(9, (s.value / top) * 100)}%` }} />
                  </i>
                  <b data-count={s.value}>0</b>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="st-col" data-col="b">
          <div className="st-card" data-a="card">
            <p className="st-label">Também entra no ar</p>
            <div className="st-pack">
              {PACKAGE.map((p) => (
                <article key={p.title} data-a="pack">
                  <Tick />
                  <b>{p.title}</b>
                  <p>{p.note}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function StepLabel({ i }: { i: number }) {
  const s = STEP_LIST[i];
  return (
    <span className="sc-step">
      <span>{s.short}</span>
      <i>{s.week}</i>
    </span>
  );
}

export function DecisionCard({ i }: { i: number }) {
  const d = DECISIONS[i];
  return (
    <article className="dc">
      <span className="dc-n">{d.n}</span>
      <h3>{d.title}</h3>
      <p>{d.note}</p>
      <span className="dc-tag" data-a="tag">
        Decisão do Recanto
      </span>
    </article>
  );
}
