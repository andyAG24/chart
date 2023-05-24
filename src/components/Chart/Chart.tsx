import React, { useEffect, useRef, MouseEvent, useCallback } from 'react';
import { CanvasEndPoints, ChartParameters, ChartProps } from './Chart.types';
import {
  getCanvasAndContext,
  getChartProxy,
  getMaxCoordValueByAxis,
  setupCanvasDimensions,
  drawAxis,
  drawLine,
} from './Chart.utils';
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

  const yMaxData = getMaxCoordValueByAxis(lines, 'y');

  const yRatio = (dpiViewHeight - 2 * PADDING) / yMaxData;

  const chartParameters: ChartParameters = {
    dpiViewHeight,
    dpiViewWidth,
    padding: PADDING,
    rowsCount: ROWS_COUNT,
    yRatio,
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

    canvas && setupCanvasDimensions(canvas, viewHeight, viewWidth, dpiRatio);

    if (context) {
      context.clearRect(0, 0, dpiViewWidth, dpiViewHeight);

      drawAxis(context, lines, proxy.mouse.x, canvasEndPoints, chartParameters);

      lines.forEach((lineData) => drawLine(context, lineData, proxy.mouse.x, chartParameters, POINTER_RADIUS));
    }
  }, [lines]);

  const proxy = getChartProxy(paint);

  useEffect(() => paint(), []);

  return <canvas ref={canvasRef} onMouseMove={mouseMoveHandler}></canvas>;
}
