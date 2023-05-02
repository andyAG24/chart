import React, { useEffect, useRef } from 'react';

interface Coord {
  x: number;
  y: number;
}

interface Props {
  coords: Coord[];
  dpiRatio?: number;
  viewHeight: number;
  viewWidth: number;
}

export function Chart({ coords: data, dpiRatio = 1, viewHeight, viewWidth }: Props) {
  const ROWS_COUNT = 5;
  const PADDING = 50;
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const dpiViewHeight = viewHeight * dpiRatio;
  const dpiViewWidth = viewWidth * dpiRatio;

  const computeLimits = (data: Coord[]) => {
    const yArr = data.map((coord) => coord.y);
    const min = Math.min(...yArr);
    const max = Math.max(...yArr);

    return { min, max };
  };

  const initCanvas = (initialCanvas: HTMLCanvasElement) => {
    initialCanvas.style.height = viewHeight + 'px';
    initialCanvas.style.width = viewWidth + 'px';
    initialCanvas.height = dpiViewHeight;
    initialCanvas.width = dpiViewWidth;
  };

  const drawYSteps = (context: CanvasRenderingContext2D) => {
    context.beginPath();
    context.strokeStyle = '#dbdbdb';

    const stepDelta = (dpiViewHeight - PADDING) / ROWS_COUNT;

    for (let index = 1; index <= ROWS_COUNT; index++) {
      const y = stepDelta * index + PADDING;

      context.fillText(String(stepDelta * index), PADDING, dpiViewHeight - y);

      context.moveTo(PADDING, dpiViewHeight - y);
      context.lineTo(dpiViewWidth - PADDING, dpiViewHeight - y);
    }

    context.stroke();
    context.closePath();
  };

  const initAxis = (context: CanvasRenderingContext2D) => {
    context.beginPath();

    context.moveTo(PADDING, PADDING);
    context.lineTo(PADDING, dpiViewHeight - PADDING);
    context.lineTo(dpiViewWidth - PADDING, dpiViewHeight - PADDING);
    context.stroke();

    context.font = '24px mono';
    context.fillText('0', dpiViewWidth - 16, dpiViewWidth + 16);

    drawYSteps(context);

    context.closePath();
  };

  const drawLine = (context: CanvasRenderingContext2D, coord: Coord) => {
    context.lineTo(coord.x + PADDING, dpiViewHeight - PADDING - coord.y);
  };

  const drawChart = (context: CanvasRenderingContext2D, initialCoords: Coord[]) => {
    context.beginPath();
    // context.moveTo(initialCoords[0].x, dpiViewHeight - initialCoords[0].y);
    initialCoords.forEach((coord) => drawLine(context, coord));
    context.stroke();
    context.closePath();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    initCanvas(canvas);
    initAxis(context);


    context.strokeStyle = 'red';
    drawChart(context, data);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    drawChart(context, data);
  }, [data]);

  return (
    <>
      <div>Chart</div>
      <canvas ref={canvasRef} style={{ border: '1px solid gray' }}></canvas>
    </>
  );
};
