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

export interface ChartProps {
  coords: Coord[];
  dpiRatio?: number;
  viewHeight: number;
  viewWidth: number;
  options: ChartOptions;
}
