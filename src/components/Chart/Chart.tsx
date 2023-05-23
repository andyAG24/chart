import React, { useEffect, useRef, MouseEvent, useCallback } from 'react';
import { ChartOptions, ChartProps, Line } from './Chart.types';
import { getCanvasAndContext, getMaxCoordValueByAxis } from './Chart.utils';
import { drawPath } from '../../utils';

const defaultOptions: ChartOptions = {
  padding: 0,
  rowsCount: 5,
  line: {
    width: 2,
  },
};

export function Chart({ dpiRatio = 1, viewHeight, viewWidth, options = defaultOptions, lines }: ChartProps) {
  const ROWS_COUNT = options.rowsCount || 5;
  const PADDING = options.padding || 0;
  const POINTER_RADIUS = 5 * dpiRatio;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const dpiViewHeight = viewHeight * dpiRatio;
  const dpiViewWidth = viewWidth * dpiRatio;

  const canvasXStart = PADDING;
  const canvasXEnd = dpiViewWidth - PADDING;
  const canvasYStart = dpiViewHeight - PADDING;
  const canvasYEnd = PADDING;

  const proxy = new Proxy<{ mouse: { x: number; y: number } }>(
    { mouse: { x: 0, y: 0 } },
    {
      set(...args) {
        const result = Reflect.set(...args);
        requestAnimationFrame(paint);
        return result;
      },
    },
  );

  const yMaxData = getMaxCoordValueByAxis(lines, 'y');

  const initCanvas = (initialCanvas: HTMLCanvasElement) => {
    initialCanvas.style.height = viewHeight + 'px';
    initialCanvas.style.width = viewWidth + 'px';
    initialCanvas.height = dpiViewHeight;
    initialCanvas.width = dpiViewWidth;
  };

  const drawYSteps = (context: CanvasRenderingContext2D) =>
    drawPath(context, () => {
      context.strokeStyle = '#dbdbdb';

      const stepY = (dpiViewHeight - 2 * PADDING) / ROWS_COUNT;
      const textStep = yMaxData / ROWS_COUNT;

      for (let index = 1; index <= ROWS_COUNT; index++) {
        const canvasY = dpiViewHeight - (stepY * index + PADDING);

        const text = Math.ceil(textStep * index);

        const textMarginX = 5;
        const textMarginY = 25;
        context.fillText(String(text), canvasXStart + textMarginX, canvasY + textMarginY);

        context.moveTo(canvasXStart, canvasY);
        context.lineTo(canvasXEnd, canvasY);
      }

      context.stroke();
    });

  const isOver = (x: number, length: number) => {
    const width = dpiViewWidth / length;
    return Math.abs(x - proxy.mouse.x) < width / 2;
  };

  const drawXStep = (context: CanvasRenderingContext2D) =>
    drawPath(context, () => {
      context.strokeStyle = 'magenta';

      const coordsMaxCount = Math.max(...lines.map((line) => line.coords.length)) - 1;

      const allXValues = new Set();
      lines.map((line) => line.coords.map((coord) => allXValues.add(coord.x)));

      const iterator = allXValues.values();

      for (let index = 1; index <= allXValues.size; index++) {
        const x = iterator.next().value;
        const canvasX = x + PADDING;

        if (isOver(canvasX, coordsMaxCount)) {
          context.save();

          context.fillText(String(x), canvasX, canvasYEnd);

          context.moveTo(canvasX, canvasYStart);
          context.lineTo(canvasX, canvasYEnd);

          context.restore();
        }
      }

      context.stroke();
    });

  const initAxis = (context: CanvasRenderingContext2D) =>
    drawPath(context, () => {
      context.moveTo(canvasXStart, canvasYEnd);
      context.lineTo(canvasXStart, canvasYStart);
      context.lineTo(canvasXEnd, canvasYStart);
      context.stroke();

      context.font = '24px mono';
      context.fillText('0', dpiViewWidth - 16, dpiViewWidth + 16);

      drawYSteps(context);
      drawXStep(context);
    });

  const drawLine = (context: CanvasRenderingContext2D, lineData: Line) => {
    const yRatio = (dpiViewHeight - 2 * PADDING) / yMaxData;

    const { coords, color, width } = lineData;

    drawPath(context, () => {
      context.lineWidth = width;
      context.strokeStyle = color;

      coords.forEach((coord) => {
        const canvasY = dpiViewHeight - (coord.y * yRatio + PADDING);
        const canvasX = coord.x + PADDING;

        context.lineTo(canvasX, canvasY);
      });
      context.stroke();
    });

    coords.forEach((coord) => {
      const canvasY = dpiViewHeight - (coord.y * yRatio + PADDING);
      const canvasX = coord.x + PADDING;

      if (isOver(canvasX, coords.length)) {
        context.save();
        drawPointer(context, canvasX, canvasY, color);
        context.restore();
      }
    });
  };

  const drawPointer = (context: CanvasRenderingContext2D, x: number, y: number, strokeColor: string) =>
    drawPath(context, () => {
      context.strokeStyle = strokeColor;
      context.fillStyle = 'white';
      context.arc(x, y, POINTER_RADIUS, 0, Math.PI * 2);
      context.fill();
      context.stroke();
    });

  const drawChart = (context: CanvasRenderingContext2D) => {
    lines.forEach((lineData) => drawLine(context, lineData));
  };

  const paint = useCallback(() => {
    const { canvas, context } = getCanvasAndContext(canvasRef);

    canvas && initCanvas(canvas);

    if (context) {
      context.clearRect(0, 0, dpiViewWidth, dpiViewHeight);

      initAxis(context);

      drawChart(context);
    }
  }, [lines]);

  const mouseMoveHandler = ({ clientX, clientY }: MouseEvent) => {
    const { canvas } = getCanvasAndContext(canvasRef);

    const clientRect = canvas?.getBoundingClientRect();
    proxy.mouse = {
      x: (clientX - (clientRect?.left || 0)) * dpiRatio,
      y: clientY,
    };
  };

  useEffect(() => paint(), []);

  return (
    <div style={{ border: '1px solid gray', display: 'flex', flexDirection: 'column' }}>
      <canvas ref={canvasRef} onMouseMove={mouseMoveHandler}></canvas>
    </div>
  );
}
