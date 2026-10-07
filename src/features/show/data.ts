/**
 * Conteúdo das cenas. Nada aqui é dado do Recanto: turmas, nomes e números são
 * exemplos de tela, e cada painel diz isso. O que é compromisso (as seis etapas,
 * as quatro semanas, quem faz o quê) veio do que foi combinado com a escola.
 */

export type ChapterId = 'fechado' | 'caminho' | 'inicio' | 'material' | 'montagem' | 'aprovacao' | 'noar' | 'rotina' | 'decisoes' | 'fecho';

export const CHAPTERS: Array<{ id: ChapterId; name: string }> = [
  { id: 'fechado', name: 'Negócio fechado' },
  { id: 'caminho', name: 'O caminho' },
  { id: 'inicio', name: '1. Reunião de início' },
  { id: 'material', name: '2. Material da escola' },
  { id: 'montagem', name: '3. Montagem' },
  { id: 'aprovacao', name: '4. Aprovação' },
  { id: 'noar', name: '5. Entrada no ar' },
  { id: 'rotina', name: '6. Relatório semanal' },
  { id: 'decisoes', name: 'Decisões do Recanto' },
  { id: 'fecho', name: 'Vamos começar' },
];

export interface Step {
  n: string;
  title: string;
  /** rótulo curto da vista geral */
  short: string;
  week: string;
  who: string;
}

export const STEP_LIST: Step[] = [
  { n: '01', title: 'Reunião de início', short: 'Reunião de início', week: 'Semana 1', who: 'Escola + equipe' },
  { n: '02', title: 'A escola envia o material', short: 'Material da escola', week: 'Semana 1', who: 'Escola' },
  { n: '03', title: 'A gente monta o sistema', short: 'Montagem', week: 'Semana 2', who: 'Equipe' },
  { n: '04', title: 'A escola aprova', short: 'Aprovação', week: 'Semana 3', who: 'Escola' },
  { n: '05', title: 'Entrada no ar, acompanhada', short: 'Entrada no ar', week: 'Semana 4', who: 'Equipe + escola' },
  { n: '06', title: 'Relatório toda semana', short: 'Relatório semanal', week: 'Toda semana', who: 'Equipe' },
];

// 01 ---------------------------------------------------------------------------
export const AGENDA = [
  'Rotina e proposta da escola',
  'Turmas, turnos e adaptação',
  'Alimentação e saúde',
  'Matrícula, rematrícula e regras',
  'As perguntas que os pais mais fazem',
];
export const ROOM = ['Coordenação', 'Secretaria', 'Equipe do projeto'];

// 02 ---------------------------------------------------------------------------
export const MATERIAL: Array<{ id: string; title: string; note: string }> = [
  { id: 'valores', title: 'Tabela de valores', note: 'Mensalidade por turma e turno, matrícula, material e descontos' },
  { id: 'turmas', title: 'Turmas, horários e vagas', note: 'Faixa etária, turnos e quantas vagas há em cada um' },
  { id: 'contrato', title: 'Contrato e regimento', note: 'Os modelos em branco, sem assinatura' },
  { id: 'calendario', title: 'Calendário do ano', note: 'Início das aulas, recessos e férias' },
  { id: 'conversas', title: 'Conversas antigas', note: 'Do WhatsApp com os pais. A gente tira nomes e telefones' },
];

// 03 ---------------------------------------------------------------------------
export const MODULES = ['Atendimento', 'Funil de matrículas', 'Turmas e vagas', 'Base da escola', 'Documentos', 'Rematrícula', 'Painel da direção'];
export const CLASSES: Array<{ name: string; shifts: string }> = [
  { name: 'Maternal', shifts: 'Manhã · Tarde' },
  { name: 'Pré', shifts: 'Manhã · Tarde' },
  { name: 'Fundamental', shifts: 'Manhã · Tarde' },
  { name: 'Ensino Médio', shifts: 'Manhã' },
];
export const RULES = ['Preço só da tabela cadastrada', 'Vaga só do sistema', 'Exceção sempre com uma pessoa'];

// 04 ---------------------------------------------------------------------------
export const REVIEW = ['Tabela de valores', 'Turmas, horários e vagas', 'Matrícula e documentos', 'Adaptação e rotina', 'Calendário', 'Tom das respostas'];

// 05 ---------------------------------------------------------------------------
export const FAMILY = { name: 'Camila', about: 'Maternal · tarde' };
export const CHAT: Array<{ id: string; from: 'mae' | 'ia' | 'sys'; text: string; time?: string }> = [
  { id: 'm1', from: 'mae', text: 'Oi! Vocês têm vaga no maternal à tarde?', time: '22:14' },
  { id: 'a1', from: 'ia', text: 'Oi, Camila! Temos, sim. Posso te passar os horários e já deixar uma visita marcada?', time: '22:14' },
  { id: 'm2', from: 'mae', text: 'Pode! E tem desconto pra irmão?', time: '22:16' },
  { id: 'a2', from: 'ia', text: 'Sobre desconto quem fala com você é a secretaria. Já avisei a equipe, e amanhã cedo te chamam por aqui.', time: '22:16' },
  { id: 's1', from: 'sys', text: 'Passado para a secretaria' },
];
export const FUNNEL = ['Contato', 'Visita', 'Documentos', 'Contrato', 'Matrícula'];

// 06 ---------------------------------------------------------------------------
export const REPORT = {
  kpis: [
    { label: 'Pais que chamaram', value: 48 },
    { label: 'Visitas marcadas', value: 19 },
    { label: 'Matrículas', value: 7 },
  ],
  stages: [
    { label: 'Contato', value: 48 },
    { label: 'Visita', value: 19 },
    { label: 'Documentos', value: 11 },
    { label: 'Contrato', value: 8 },
    { label: 'Matrícula', value: 7 },
  ],
};
export const PACKAGE = [
  { title: 'Funil de matrículas', note: 'Cada família numa etapa visível' },
  { title: 'Documentos e contrato', note: 'A lista certa, pedida no WhatsApp' },
  { title: 'Rematrícula', note: 'Quem já é aluno, chamado no prazo' },
  { title: 'Painel da direção', note: 'Os números da semana numa tela' },
];

// decisões ---------------------------------------------------------------------
export const DECISIONS = [
  { n: 'A', title: 'Pessoa de referência', note: 'Quem na escola fala com a equipe e aprova o material antes de ele ir para o atendente.' },
  { n: 'B', title: 'Número do WhatsApp', note: 'O atendente entra no número que a escola já usa ou em um número novo.' },
  { n: 'C', title: 'Data da reunião de início', note: 'Uma hora na escola, com a coordenação e a secretaria juntas.' },
];

// fecho ------------------------------------------------------------------------
export const CONTACT = {
  label: '(92) 8553-2630',
  href: 'https://wa.me/559285532630?text=' + encodeURIComponent('Olá! Vi os próximos passos da Fábrica de Matrículas no Recanto Interativo.'),
};
