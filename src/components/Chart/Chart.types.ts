export interface Coord {
  x: number;
  y: number;
}

export interface Line {
  color: string;
  width: number;
  coords: Coord[];
}

type CanvasEndPointsKey = 'xStart' | 'xEnd' | 'yStart' | 'yEnd';

export type CanvasEndPoints = {
  [x in CanvasEndPointsKey]: number;
};

export interface PointerParameters {
  color: string;
  fillColor: string;
  radius: number;
}

export interface ChartConfig {
  padding?: number;
  rowsCount?: number;
  pointer?: {
    radius: number;
  };
}

export type Ratio = {
  [key in 'x' | 'y']: number;
};

export interface ChartParameters extends Required<Omit<ChartConfig, 'pointer'>> {
  dpiViewHeight: number;
  dpiViewWidth: number;
  ratio: Ratio;
}

export interface ChartProps {
  dpiRatio?: number;
  viewHeight: number;
  viewWidth: number;
  config: ChartConfig;
  lines: Line[];
}
