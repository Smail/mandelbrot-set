const settings = {
  set posX(value) {
    return document.getElementById("pos-x").value = value;
  },
  get posX() {
    return eval(document.getElementById("pos-x").value);
  },
  set posY(value) {
    return document.getElementById("pos-y").value = value;
  },
  get posY() {
    return eval(document.getElementById("pos-y").value);
  },
  set zoom(value) {
    return document.getElementById("zoom").value = Math.max(1, value);
  },
  get zoom() {
    return eval(document.getElementById("zoom").value);
  },
  get zoomFunction() {
    const checkedInput = () => document.querySelector('input[name="zoom-function"]:checked');
    const userFunction = checkedInput().value;

    try {
      // Try executing the function to catch any errors
      eval(userFunction)(0);
      return eval(userFunction);
    } catch (e) {
      if (userFunction.length > 0) {
        alert(`Invalid zoom function: "${checkedInput().value}"\nError: ${e.message}`);

        // Set a different (random) zoom function and return it if possible
        document.querySelector('input[name="zoom-function"]:not(:checked)').checked = true;
        return eval(checkedInput().value);
      } else {
        // Return linear function if user hasn't supplied any function, yet.
        return x => x;
      }
    }
  },
}

function setCustomZoomFunction(value) {
  document.getElementById('custom-zoom-func-radio-btn').value = `x => ${value}`;
  update();
}

function setCanvasSize(canvas) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawFrame() {
  const mandelbrotCanvas = document.getElementById("mandelbrot-canvas");
  setCanvasSize(mandelbrotCanvas);

  render.setOutput([window.innerWidth, window.innerHeight]);
  render(window.innerWidth, window.innerHeight, settings.posX, settings.posY, settings.zoomFunction(settings.zoom));

  mandelbrotCanvas.replaceWith(render.canvas);
  render.canvas.id = "mandelbrot-canvas";
}

let lastFrameTime = 0;

function update() {
  const diff = performance.now() - lastFrameTime;
  const fps = 60;

  if (diff < 1000 / fps) {
    return;
  }

  lastFrameTime = performance.now();
  requestAnimationFrame(drawFrame);
}

const gpu = new GPU();
const render = gpu.createKernel(function (width, height, posX, posY, zoom) {
  const maxIter = this.constants.iterations;
  const px = this.thread.x;
  const py = this.thread.y;

  this.color(1, 1, 1, 1);

  const x0 = (px - width / 2 - posX) / zoom;
  const y0 = (py - height / 2 - posY) / zoom;
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

window.addEventListener("resize", update);
update();
