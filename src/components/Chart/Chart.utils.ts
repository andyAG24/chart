import { drawPath } from '../../utils';
import { CanvasEndPoints, ChartConfig, Line } from './Chart.types';

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

export const drawYSteps = (
  context: CanvasRenderingContext2D,
  yMax: number,
  { xStart, xEnd }: CanvasEndPoints,
  { dpiViewHeight, padding: PADDING, rowsCount: ROWS_COUNT }: ChartConfig,
) =>
  drawPath(context, () => {
    context.strokeStyle = '#dbdbdb';

    const stepY = (dpiViewHeight - 2 * PADDING) / ROWS_COUNT;
    const textStep = yMax / ROWS_COUNT;

    for (let index = 1; index <= ROWS_COUNT; index++) {
      const canvasY = dpiViewHeight - (stepY * index + PADDING);

      const text = Math.ceil(textStep * index);

      const textMarginX = 5;
      const textMarginY = 25;
      context.fillText(String(text), xStart + textMarginX, canvasY + textMarginY);

      context.moveTo(xStart, canvasY);
      context.lineTo(xEnd, canvasY);
    }

    context.stroke();
  });
