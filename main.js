const settings = {
  positionClipValue: 1.5,
  set posX(value) {
    value = (value < 0 ? -1 : 1) * Math.min(this.positionClipValue, Math.abs(value));
    return document.getElementById("pos-x").value = value;
  },
  get posX() {
    return eval(document.getElementById("pos-x").value);
  },
  set posY(value) {
    value = (value < 0 ? -1 : 1) * Math.min(this.positionClipValue, Math.abs(value));
    return document.getElementById("pos-y").value = value;
  },
  get posY() {
    return eval(document.getElementById("pos-y").value);
  },
  set zoom(value) {
    // Prevent user from zooming in too far, i.e., everything is one big blob of color.
    if (this.zoomFunction(value) >= 1318815734) {
      return;
    }
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
  get colorFactors() {
    function value(el) {
      return Number.parseInt(el.max) - Number.parseInt(el.value) + Number.parseInt(el.min);
    }

    const redFactorEl = document.getElementById("red-factor");
    const greenFactorEl = document.getElementById("green-factor");
    const blueFactorEl = document.getElementById("blue-factor");

    return [value(redFactorEl), value(greenFactorEl), value(blueFactorEl)];
  },
  get backgroundColor() {
    function value(id) {
      return Math.min(Math.max(0, Number.parseFloat(document.getElementById(id).value)), 1);
    }

    return [
      value("bg-red"),
      value("bg-green"),
      value("bg-blue"),
      1
    ]
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
  render(window.innerWidth, window.innerHeight, settings.posX, settings.posY, settings.zoomFunction(settings.zoom),
    settings.backgroundColor, settings.colorFactors);

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
const render = gpu.createKernel(function (width, height, posX, posY, zoom, bgColor, colorFactors) {
  const maxIter = this.constants.iterations;
  const px = this.thread.x;
  const py = this.thread.y;

  this.color(bgColor[0], bgColor[1], bgColor[2], bgColor[3]);

  const x0 = (px - width / 2) / zoom + posX;
  const y0 = (py - height / 2) / zoom - posY;
  let x = 0.0;
  let y = 0.0;

  for (let i = 0; i < maxIter; i++) {
    const xTemp = (x * x) - (y * y) + x0;
    y = 2 * x * y + y0;
    x = xTemp;

    if (xTemp > maxIter) {
      const tNormal = i / maxIter;
      const red = tNormal * (Math.sin(i) + (maxIter / colorFactors[0]) + 1) / 2;
      const green = tNormal * (Math.sin(i) + (maxIter / colorFactors[1]) + 1) / 2;
      const blue = tNormal * (Math.sin(i) + (maxIter / colorFactors[2]) + 1) / 2;

      this.color(red, green, blue, 1);
      break;
    }
  }
}, {
  constants: {iterations: 200}
}).setDynamicOutput(true)
  .setGraphical(true);

window.addEventListener("resize", update);
update();

function toggleShowSideBarBtn() {
  const closed = document.getElementById("show-sidebar-btn-closed");
  const open = document.getElementById("show-sidebar-btn-open");
  const tmp = open.style.display;
  const isOpen = open.style.display === 'none';

  open.style.display = closed.style.display;
  closed.style.display = tmp;

  const settings = document.getElementById("settings");
  const children = Array.from(settings.children).filter(el => !el.classList.contains("show-sidebar-btn"));
  children.forEach(el => el.style.display = isOpen ? null : 'none');

  if (!isOpen) {
    settings.classList.add("closed");
  } else {
    settings.classList.remove("closed");
  }
}
