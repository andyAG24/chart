export const drawPath = (context: CanvasRenderingContext2D, callback: () => void) => {
  context.beginPath();
  callback();
  context.closePath();
};
