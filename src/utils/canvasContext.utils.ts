export const canvasPath = (context: CanvasRenderingContext2D, callback: () => void) => {
  context.beginPath();
  callback();
  context.closePath();
};
