import { Line } from './Chart.types';

export const getMaxCoordValueByAxis = (lines: Line[], axis: 'x' | 'y') =>
  Math.max(...lines.map((line) => Math.max(...line.coords.map((coord) => coord[axis]))));

export const getCanvasAndContext = (
  ref: React.MutableRefObject<HTMLCanvasElement | null>,
): {
  canvas: HTMLCanvasElement | null;
  context: CanvasRenderingContext2D | null | undefined;
} => {
  const canvas = ref.current;
  const context = canvas?.getContext('2d');
  return { canvas, context };
};
