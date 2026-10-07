/**
 * Mapa do mundo da apresentação. Unidades = px CSS no plano focal: um painel
 * de 1180 px ocupa 1180 unidades. x→direita, y→cima, z→câmera.
 * Este arquivo é só dado (sem three), para o shell importar sem puxar o motor.
 *
 * O filme anda da esquerda para a direita e sobe: abertura na origem, seis
 * estações em degraus, as decisões da escola e o fecho lá no alto.
 */

export type Vec3 = [number, number, number];

export interface ObjSpec {
  id: string;
  /** posição de repouso (centro do elemento) */
  pos: Vec3;
  /** rotação de repouso em graus (x, y, z) */
  rot?: Vec3;
  /** fator de super-amostragem do DOM (conteúdo rasterizado res× maior) */
  res?: number;
  /** sempre de frente pra câmera */
  billboard?: boolean;
  /** desfoca conforme a distância ao plano de foco */
  dof?: boolean;
  scale?: number;
}

export const STATION = { w: 1180, h: 680 } as const;
export const STEPS = 6;

const stationPos = (i: number): Vec3 => [2800 + i * 2200, -300 + i * 120, i % 2 ? -220 : 0];
const stationYaw = (i: number) => (i % 2 ? -9 : 9);

export const STATIONS: ObjSpec[] = Array.from({ length: STEPS }, (_, i) => ({
  id: `s${i + 1}`,
  pos: stationPos(i),
  rot: [0, stationYaw(i), 0] as Vec3,
  res: 1.45,
}));

/** centro da cena das três decisões e do fecho */
export const DECIDE: Vec3 = [16300, 420, 0];
export const END: Vec3 = [19000, 560, 0];
/** altura do selo do Recanto no fecho (unidades de mundo) */
export const BADGE_H = 640;
export const BADGE_AT: Vec3 = [END[0], END[1] + 190, END[2]];

export const OBJECTS: ObjSpec[] = [
  ...STATIONS,

  // rótulos das etapas na vista geral do caminho
  ...STATIONS.map(
    (s, i) => ({ id: `lb${i + 1}`, pos: [s.pos[0], s.pos[1] + 520, s.pos[2]] as Vec3, billboard: true, res: 2, scale: 5 }) satisfies ObjSpec,
  ),

  // decisões do lado da escola
  { id: 'd1', pos: [DECIDE[0] - 700, DECIDE[1], DECIDE[2] - 120], rot: [0, 13, 0], res: 1.45 },
  { id: 'd2', pos: [DECIDE[0], DECIDE[1], DECIDE[2] + 60], res: 1.45 },
  { id: 'd3', pos: [DECIDE[0] + 700, DECIDE[1], DECIDE[2] - 120], rot: [0, -13, 0], res: 1.45 },

  // selo do Recanto, nítido por cima das partículas
  { id: 'badge', pos: BADGE_AT, billboard: true, res: 2 },
];

/** trilho luminoso que liga tudo: passa por baixo de cada estação */
export const RAIL: Vec3[] = [
  [520, -620, 0],
  ...STATIONS.map((s) => [s.pos[0], s.pos[1] - 480, s.pos[2] + 40] as Vec3),
  [DECIDE[0], DECIDE[1] - 420, DECIDE[2]],
  // termina atrás do selo: o caminho acaba na escola
  [BADGE_AT[0], BADGE_AT[1] - 60, BADGE_AT[2] - 90],
];
/** fração do trilho em que cada ponto de controle cai (0..1) */
export const railAt = (index: number) => index / (RAIL.length - 1);

export interface CamState {
  cx: number;
  cy: number;
  cz: number;
  /** retângulo do mundo que precisa caber na tela */
  w: number;
  h: number;
  yaw: number;
  pitch: number;
  roll: number;
  /** desloca o enquadramento na tela (fração da largura/altura): abre espaço pro texto */
  ox: number;
  oy: number;
}

export interface FxState {
  /** índice fracionário na lista de formações das partículas */
  form: number;
  turb: number;
  reveal: number;
  pAlpha: number;
  bokeh: number;
  /** 0 = cor do tema; 1 = cada partícula com a cor do pixel do selo */
  tint: number;
  /** o "feito" extrudado da abertura */
  mark: number;
  markYaw: number;
  markPitch: number;
  markScale: number;
  glow: number;
  glowX: number;
  glowY: number;
  grid: number;
  /** quanto do trilho já foi desenhado (0..1) */
  rail: number;
  /** brilho do primeiro ponto (o "sinal" da abertura) */
  signal: number;
}

export interface ObjState {
  x: number;
  y: number;
  z: number;
  rx: number;
  ry: number;
  rz: number;
  s: number;
  o: number;
}

export const FORMS = { scatter: 0, mark: 1, path: 2, dust: 3, badge: 4 } as const;

export const deg = (d: number) => (d * Math.PI) / 180;

/** ponto local do painel (px a partir do canto superior esquerdo) → mundo */
export function panelPoint(spec: ObjSpec, size: { w: number; h: number }, px: number, py: number, lift = 0): Vec3 {
  const lx = px - size.w / 2;
  const ly = size.h / 2 - py;
  const ry = deg(spec.rot?.[1] ?? 0);
  const cos = Math.cos(ry);
  const sin = Math.sin(ry);
  // rotação só em Y (as estações não inclinam em X/Z)
  return [spec.pos[0] + lx * cos + lift * sin, spec.pos[1] + ly, spec.pos[2] - lx * sin + lift * cos];
}

export const specOf = (id: string) => OBJECTS.find((o) => o.id === id)!;
