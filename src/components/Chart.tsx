import React, { useEffect, useRef } from 'react';
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

  const yMaxData = Math.max(...lines.map((line) => Math.max(...line.coords.map((coord) => coord.y))));

  const initCanvas = (initialCanvas: HTMLCanvasElement) => {
    initialCanvas.style.height = viewHeight + 'px';
    initialCanvas.style.width = viewWidth + 'px';
    initialCanvas.height = dpiViewHeight;
    initialCanvas.width = dpiViewWidth;
  };

  const drawYSteps = (context: CanvasRenderingContext2D) => {
    context.beginPath();
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
    context.closePath();
  };

  const initAxis = (context: CanvasRenderingContext2D) => {
    context.beginPath();

    context.moveTo(canvasXStart, canvasYEnd);
    context.lineTo(canvasXStart, canvasYStart);
    context.lineTo(canvasXEnd, canvasYStart);
    context.stroke();

    context.font = '24px mono';
    context.fillText('0', dpiViewWidth - 16, dpiViewWidth + 16);

    drawYSteps(context);

    context.closePath();
  };

  const drawLine = (context: CanvasRenderingContext2D, lineData: Line) => {
    const yRatio = (dpiViewHeight - 2 * PADDING) / yMaxData;

    const { coords, color, width } = lineData;

    context.beginPath();

    context.lineWidth = width;
    context.strokeStyle = color;

    coords.forEach((coord) => {
      const canvasY = dpiViewHeight - (coord.y * yRatio + PADDING);
      const canvasX = coord.x + PADDING;

      context.lineTo(canvasX, canvasY);
    });

    context.stroke();
    context.closePath();
  };

  const drawChart = (context: CanvasRenderingContext2D) => {
    lines.forEach((lineData) => drawLine(context, lineData));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    initCanvas(canvas);
    initAxis(context);

    drawChart(context);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    drawChart(context);
  }, [lines]);

  return (
    <>
      <div>Chart</div>
      <canvas ref={canvasRef} style={{ border: '1px solid gray' }}></canvas>
    </>
  );
}
