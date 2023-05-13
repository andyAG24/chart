import { Line } from './Chart.types';

export const getMaxCoordValueByAxis = (lines: Line[], axis: 'x' | 'y') =>
  Math.max(...lines.map((line) => Math.max(...line.coords.map((coord) => coord[axis]))));
