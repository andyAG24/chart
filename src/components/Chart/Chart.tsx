import React, { useEffect, useRef, MouseEvent, useCallback } from 'react';
import { CanvasEndPoints, ChartParameters, ChartProps, Line } from './Chart.types';
import { drawXStep, drawYSteps, getCanvasAndContext, getMaxCoordValueByAxis, isOver } from './Chart.utils';
import { drawPath } from '../../utils';
import { defaultConfig } from './Chart.config';

export function Chart({ dpiRatio = 1, viewHeight, viewWidth, config = defaultConfig, lines }: ChartProps) {
  const ROWS_COUNT = config.rowsCount || defaultConfig.rowsCount;
  const PADDING = config.padding || defaultConfig.padding;
  const POINTER_RADIUS = (config.pointer?.radius || defaultConfig.pointer.radius) * dpiRatio;

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const dpiViewHeight = viewHeight * dpiRatio;
  const dpiViewWidth = viewWidth * dpiRatio;

  const canvasEndPoints: CanvasEndPoints = {
    xStart: PADDING,
    xEnd: dpiViewWidth - PADDING,
    yStart: dpiViewHeight - PADDING,
    yEnd: PADDING,
  };

  const chartParameters: ChartParameters = {
    dpiViewHeight,
    dpiViewWidth,
    padding: PADDING,
    rowsCount: ROWS_COUNT,
  };

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

  const initAxis = (context: CanvasRenderingContext2D) =>
    drawPath(context, () => {
      context.moveTo(canvasEndPoints.xStart, canvasEndPoints.yEnd);
      context.lineTo(canvasEndPoints.xStart, canvasEndPoints.yStart);
      context.lineTo(canvasEndPoints.xEnd, canvasEndPoints.yStart);
      context.stroke();

      context.font = '24px mono';
      context.fillText('0', dpiViewWidth - 16, dpiViewWidth + 16);

      drawYSteps(context, yMaxData, canvasEndPoints, chartParameters);
      drawXStep(context, lines, proxy.mouse.x, canvasEndPoints, chartParameters);
    });

  const drawLine = (context: CanvasRenderingContext2D, lineData: Line) => {
    const yRatio = (dpiViewHeight - 2 * PADDING) / yMaxData;

    const { coords, color, width } = lineData;

    const getCanvasX = (x: number) => x + PADDING;
    const getCanvasY = (y: number) => dpiViewHeight - (y * yRatio + PADDING);

    drawPath(context, () => {
      context.lineWidth = width;
      context.strokeStyle = color;

      coords.forEach((coord) => {
        context.lineTo(getCanvasX(coord.x), getCanvasY(coord.y));
      });
      context.stroke();
    });

    coords.forEach((coord) => {
      if (isOver(getCanvasX(coord.x), proxy.mouse.x, coords.length, dpiViewWidth)) {
        context.save();
        drawPointer(context, getCanvasX(coord.x), getCanvasY(coord.y), color);
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

  const mouseMoveHandler = ({ clientX, clientY }: MouseEvent) => {
    const { canvas } = getCanvasAndContext(canvasRef);

    const clientRect = canvas?.getBoundingClientRect();
    proxy.mouse = {
      x: (clientX - (clientRect?.left || 0)) * dpiRatio,
      y: clientY,
    };
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

  useEffect(() => paint(), []);

  return (
    <div style={{ border: '1px solid gray', display: 'flex', flexDirection: 'column' }}>
      <canvas ref={canvasRef} onMouseMove={mouseMoveHandler}></canvas>
    </div>
  );
}
