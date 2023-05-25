import { canvasPath } from '../../utils';
import { CanvasEndPoints, ChartParameters, Coord, Line, PointerParameters } from './Chart.types';

// GET UTILITIES

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

export const getChartProxy = (cb: () => void) =>
  new Proxy<{ mouse: { x: number; y: number } }>(
    { mouse: { x: 0, y: 0 } },
    {
      set(...args) {
        const result = Reflect.set(...args);
        requestAnimationFrame(cb);
        return result;
      },
    },
  );

export const getCanvasX = (x: number, { padding }: ChartParameters) => x + padding;
export const getCanvasY = (y: number, { dpiViewHeight, padding, yRatio }: ChartParameters) =>
  dpiViewHeight - (y * yRatio + padding);

// CHECKERS

export const isOver = (x: number, mouseX: number, length: number, dpiViewWidth: number) => {
  const width = dpiViewWidth / length;
  return Math.abs(x - mouseX) < width / 2;
};

// DRAWING UTILITIES

const drawYSteps = (
  context: CanvasRenderingContext2D,
  yMax: number,
  { xStart, xEnd }: CanvasEndPoints,
  { dpiViewHeight, padding: PADDING, rowsCount: ROWS_COUNT }: ChartParameters,
) =>
  canvasPath(context, () => {
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

const drawXStep = (
  context: CanvasRenderingContext2D,
  lines: Line[],
  mouseX: number,
  { yStart, yEnd }: CanvasEndPoints,
  { padding: PADDING, dpiViewWidth }: ChartParameters,
) =>
  canvasPath(context, () => {
    context.strokeStyle = 'magenta';

    const coordsMaxCount = Math.max(...lines.map((line) => line.coords.length)) - 1;

    const allXValues = new Set();
    lines.map((line) => line.coords.map((coord) => allXValues.add(coord.x)));

    const iterator = allXValues.values();

    for (let index = 1; index <= allXValues.size; index++) {
      const x = iterator.next().value;
      const canvasX = x + PADDING;

      if (isOver(canvasX, mouseX, coordsMaxCount, dpiViewWidth)) {
        context.save();

        context.fillText(String(x), canvasX, yEnd);

        context.moveTo(canvasX, yStart);
        context.lineTo(canvasX, yEnd);

        context.restore();
      }
    }

    context.stroke();
  });

export const drawAxis = (
  context: CanvasRenderingContext2D,
  lines: Line[],
  mouseX: number,
  canvasEndPoints: CanvasEndPoints,
  chartParameters: ChartParameters,
) => {
  const yMaxData = getMaxCoordValueByAxis(lines, 'y');

  return canvasPath(context, () => {
    context.moveTo(canvasEndPoints.xStart, canvasEndPoints.yEnd);
    context.lineTo(canvasEndPoints.xStart, canvasEndPoints.yStart);
    context.lineTo(canvasEndPoints.xEnd, canvasEndPoints.yStart);
    context.stroke();

    context.font = '24px mono';
    context.fillText('0', chartParameters.dpiViewWidth - 16, chartParameters.dpiViewWidth + 16);

    drawYSteps(context, yMaxData, canvasEndPoints, chartParameters);
    drawXStep(context, lines, mouseX, canvasEndPoints, chartParameters);
  });
};

export const drawLine = (
  context: CanvasRenderingContext2D,
  line: Line,
  mouseX: number,
  chartParameters: ChartParameters,
  pointerRadius: number,
) => {
  const { coords, color, width } = line;

  canvasPath(context, () => {
    context.lineWidth = width;
    context.strokeStyle = color;

    coords.forEach(({ x, y }) => {
      context.lineTo(getCanvasX(x, chartParameters), getCanvasY(y, chartParameters));
    });
    context.stroke();
  });

  coords.forEach(({ x, y }) => {
    const canvasX = getCanvasX(x, chartParameters);
    if (isOver(canvasX, mouseX, coords.length, chartParameters.dpiViewWidth)) {
      context.save();
      drawPointer(
        context,
        { x: canvasX, y: getCanvasY(y, chartParameters) },
        { color, fillColor: 'white', radius: pointerRadius },
      );
      context.restore();
    }
  });
};

export const drawPointer = (
  context: CanvasRenderingContext2D,
  { x, y }: Coord,
  { color, fillColor, radius }: PointerParameters,
) =>
  canvasPath(context, () => {
    context.strokeStyle = color;
    context.fillStyle = fillColor;
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
    context.stroke();
  });

// OTHER UTILITIES

export const setupCanvasDimensions = (canvas: HTMLCanvasElement, height: number, width: number, dpiRatio: number) => {
  canvas.style.height = height + 'px';
  canvas.style.width = width + 'px';
  canvas.height = height * dpiRatio;
  canvas.width = width * dpiRatio;
};
