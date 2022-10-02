const mandelbrotCanvas = document.getElementById("mandelbrot-canvas");

function setCanvasSize(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

setCanvasSize(mandelbrotCanvas);

const ctx = mandelbrotCanvas.getContext("2d");
