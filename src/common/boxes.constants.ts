export const BOXES = [
  { id: "Caixa 1", dims: [30, 40, 80] },
  { id: "Caixa 2", dims: [50, 50, 40] },
  { id: "Caixa 3", dims: [50, 80, 60] },
];

export function volumeOf(dims: number[]) {
  return dims[0] * dims[1] * dims[2];
}
