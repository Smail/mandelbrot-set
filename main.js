function setCanvasSize(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawFrame() {
  const mandelbrotCanvas = document.getElementById("mandelbrot-canvas");
  setCanvasSize(mandelbrotCanvas);

  render.setOutput([window.innerWidth, window.innerHeight]);
  render(window.innerWidth, window.innerHeight);

  mandelbrotCanvas.replaceWith(render.canvas);
  render.canvas.id = "mandelbrot-canvas";
}

const gpu = new GPU();
const render = gpu.createKernel(function (width, height) {
  const maxIter = this.constants.iterations;
  const px = this.thread.x;
  const py = this.thread.y;

  this.color(1, 1, 1, 1);

  const zoom = Math.exp(6);
  const x0 = (px - width / 2) / zoom;
  const y0 = (py - height / 2) / zoom;
  let x = 0.0;
  let y = 0.0;

  for (let i = 0; i < maxIter; i++) {
    const xTemp = (x * x) - (y * y) + x0;
    y = 2 * x * y + y0;
    x = xTemp;

    if (xTemp > maxIter) {
      const tNormal = i / maxIter;
      const red = tNormal * (Math.cos(i) + 1) / 2;
      const green = tNormal;
      const blue = tNormal * 0.5;

      this.color(red, green, blue, 1);
      break;
    }
  }
}, {
  constants: {iterations: 1000}
}).setDynamicOutput(true)
  .setGraphical(true);

requestAnimationFrame(drawFrame);
window.addEventListener("resize", () => requestAnimationFrame(drawFrame));
