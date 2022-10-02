function setCanvasSize(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawFrame() {
  const mandelbrotCanvas = document.getElementById("mandelbrot-canvas");
  setCanvasSize(mandelbrotCanvas);
}

requestAnimationFrame(drawFrame);
