const mandelbrotCanvas = document.getElementById("mandelbrot-canvas");

function setCanvasSize(canvas) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

setCanvasSize(mandelbrotCanvas);
