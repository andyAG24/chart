import React, { useEffect, useRef, MouseEvent, useCallback } from 'react';
import { ChartOptions, ChartProps, Line } from './Chart.types';

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

  const yMaxData = Math.max(...lines.map((line) => Math.max(...line.coords.map((coord) => coord.y))));

  const getCanvasAndContext = (): {
    canvas: HTMLCanvasElement | null;
    context: CanvasRenderingContext2D | null | undefined;
  } => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    return { canvas, context };
  };

  const initCanvas = (initialCanvas: HTMLCanvasElement) => {
    initialCanvas.style.height = viewHeight + 'px';
    initialCanvas.style.width = viewWidth + 'px';
    initialCanvas.height = dpiViewHeight;
    initialCanvas.width = dpiViewWidth;
  };

  const drawPath = (context: CanvasRenderingContext2D, callback: () => void) => {
    context.beginPath();
    callback();
    context.closePath();
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

  const initAxis = (context: CanvasRenderingContext2D) =>
    drawPath(context, () => {
      context.moveTo(canvasXStart, canvasYEnd);
      context.lineTo(canvasXStart, canvasYStart);
      context.lineTo(canvasXEnd, canvasYStart);
      context.stroke();

      context.font = '24px mono';
      context.fillText('0', dpiViewWidth - 16, dpiViewWidth + 16);

      drawYSteps(context);
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
  };

  const drawChart = (context: CanvasRenderingContext2D) => {
    lines.forEach((lineData) => drawLine(context, lineData));
  };

  const paint = useCallback(() => {
    const { canvas, context } = getCanvasAndContext();

    canvas && initCanvas(canvas);

    if (context) {
      context.clearRect(0, 0, dpiViewWidth, dpiViewHeight);

      initAxis(context);

      drawChart(context);
    }
    console.log(proxy.mouse);
  }, [lines]);

  const mouseMoveHandler = ({ clientX, clientY }: MouseEvent) => {
    proxy.mouse = {
      x: clientX,
      y: clientY,
    };
  };

  useEffect(() => paint(), []);

  return (
    <>
      <div>Chart</div>
      <canvas ref={canvasRef} style={{ border: '1px solid gray' }} onMouseMove={mouseMoveHandler}></canvas>
    </>
  );
}
