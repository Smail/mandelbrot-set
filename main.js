function setCanvasSize(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawMandelbrot(canvas, maxIter) {
  const ctx = canvas.getContext("2d");

  for (let px = 0; px < canvas.width; px++) {
    for (let py = 0; py < canvas.height; py++) {
      const x0 = (px / canvas.width) * (2.47) - 2;
      const y0 = (py / canvas.height) * (2.47) - 1.12;
      let x = x0;
      let y = y0;

      for (let t = 0; t < maxIter; t++) {
        const xTemp = (x * x) - (y * y) + x0;
        y = 2 * x * y + y0;
        x = xTemp;

        if (xTemp > maxIter) {
          const tNormal = t / maxIter;
          const red = tNormal;
          const green = tNormal;
          const blue = tNormal;

          ctx.fillStyle = `rgb(${red * 3}, ${green}, ${blue / 2})`;
          ctx.fillRect(px, py, 3, 3);

          break;
        }
      }
    }
  }
}

function drawFrame() {
  const mandelbrotCanvas = document.getElementById("mandelbrot-canvas");
  setCanvasSize(mandelbrotCanvas);
  drawMandelbrot(mandelbrotCanvas, 200);
}

requestAnimationFrame(drawFrame);
