/**
 * Frases da apresentação. Cada uma descreve o que vai ser feito e por quem;
 * nenhuma promete resultado.
 */
export interface CopyLine {
  id: string;
  h: string;
  p?: string;
  /** center = abertura; big = frase de impacto sobre a cena; padrão = coluna lateral */
  pos?: 'center' | 'big';
}

export const COPY: CopyLine[] = [
  { id: 'open-a', pos: 'center', h: 'Negócio fechado.' },
  { id: 'open-b', pos: 'center', h: 'Agora a gente coloca no ar.' },
  {
    id: 'path-a',
    pos: 'big',
    h: 'Seis etapas, quatro semanas.',
    p: 'Da primeira conversa na escola ao atendimento rodando no WhatsApp.',
  },
  {
    id: 'path-b',
    pos: 'big',
    h: 'Cada etapa tem dono.',
    p: 'Uma parte é da escola, outra é da equipe. Está tudo aqui.',
  },
  {
    id: 's1',
    h: 'Começa com uma conversa.',
    p: 'Uma hora na escola, com a coordenação e a secretaria. A conversa é gravada e vira a base do atendente.',
  },
  {
    id: 's2',
    h: 'A escola envia o material.',
    p: 'É o que o atendente vai saber. Ficha de aluno, dado de saúde e contrato assinado ficam de fora.',
  },
  {
    id: 's3',
    h: 'A equipe monta o sistema.',
    p: 'Turmas, vagas e preços cadastrados, base de conhecimento pronta e o atendente no jeito que a secretaria fala.',
  },
  {
    id: 's4',
    h: 'Nada vai ao ar sem o OK da escola.',
    p: 'A coordenação revisa item por item e testa conversando com o atendente.',
  },
  {
    id: 's5a',
    h: 'No ar, com a equipe acompanhando.',
    p: 'O atendente responde no WhatsApp da escola, inclusive à noite e no fim de semana.',
  },
  {
    id: 's5b',
    h: 'Exceção vai para uma pessoa.',
    p: 'Desconto, reclamação e caso especial sempre passam para a secretaria.',
  },
  {
    id: 's6a',
    h: 'Toda semana, um relatório.',
    p: 'Quantos pais chamaram, quantas visitas, quantas matrículas e em que etapa os pais param.',
  },
  {
    id: 's6b',
    h: 'E o pacote inteiro ligado.',
    p: 'Funil, documentos, rematrícula e painel da direção.',
  },
  {
    id: 'dec',
    pos: 'big',
    h: 'Do lado do Recanto, três decisões.',
    p: 'Com elas, a semana 1 começa.',
  },
];
