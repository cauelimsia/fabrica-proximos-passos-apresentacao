/**
 * Contorno do "feito" da abertura: um único polígono fechado, sem furos.
 * Coordenadas no espaço do desenho: x→direita, y→baixo, caixa 0..100 × 0..82.
 */
const BOX = { w: 100, h: 82 };

const OUTLINE: Array<[number, number]> = [
  [6, 44],
  [22, 28],
  [40, 46],
  [78, 8],
  [94, 24],
  [40, 78],
];

/** Mesmo contorno centrado na origem, y para cima, na altura pedida (unidades de mundo). */
export function markOutlineCentered(height: number): Array<[number, number]> {
  const k = height / BOX.h;
  return OUTLINE.map(([x, y]) => [(x - BOX.w / 2) * k, (BOX.h / 2 - y) * k]);
}

export const markWidth = (height: number) => (height * BOX.w) / BOX.h;

export function pointInPolygon(x: number, y: number, poly: Array<[number, number]>) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

/** Path SVG do "feito" (carregamento e fallback sem WebGL). */
export const MARK_VIEWBOX = `0 0 ${BOX.w} ${BOX.h}`;
export const MARK_PATH = OUTLINE.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join(' ') + ' Z';
