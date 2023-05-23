export interface Coord {
  x: number;
  y: number;
}

export interface ChartOptions {
  padding?: number;
  rowsCount?: number;
  line?: {
    width?: number;
  };
}

export interface Line {
  color: string;
  width: number;
  coords: Coord[];
}

export interface ChartProps {
  dpiRatio?: number;
  viewHeight: number;
  viewWidth: number;
  options: ChartOptions;

  lines: Line[];
}

type CanvasEndPointsKey = 'xStart' | 'xEnd' | 'yStart' | 'yEnd';

export type CanvasEndPoints = {
  [x in CanvasEndPointsKey]: number;
};

export interface ChartConfig {
  rowsCount: number;
  dpiViewHeight: number;
  padding: number;
}
