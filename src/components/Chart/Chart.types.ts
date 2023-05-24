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
  config: ChartConfig;
  lines: Line[];
}

type CanvasEndPointsKey = 'xStart' | 'xEnd' | 'yStart' | 'yEnd';

export type CanvasEndPoints = {
  [x in CanvasEndPointsKey]: number;
};

export interface ChartParameters {
  rowsCount: number;
  dpiViewHeight: number;
  dpiViewWidth: number;
  padding: number;
}
