let isPointerDown = false;
let lastX, lastY;

addEventListener("pointerdown", (e) => {
  if (!e.isPrimary) return;
  isPointerDown = true;
  lastX = e.clientX;
  lastY = e.clientY;
});

addEventListener("pointerup", () => {
  isPointerDown = false;
  document.body.style.userSelect = null;
});

addEventListener("pointermove", (e) => {
  if (!isPointerDown) return;

  const deltaX = e.clientX - lastX;
  const deltaY = e.clientY - lastY;

  settings.posX += deltaX / settings.zoomFunction(settings.zoom);
  settings.posY -= deltaY / settings.zoomFunction(settings.zoom);

  // Prevent user from selecting text in the settings section when moving around with the mouse
  document.body.style.userSelect = "none";

  lastX = e.clientX;
  lastY = e.clientY;

  update();
});

addEventListener("wheel", (e) => {
  let zoomDelta = e.deltaY < 0 ? 1 : -1;
  if (e.shiftKey) zoomDelta *= 10;

  console.log(zoomDelta);
  settings.zoom += zoomDelta;

  update();
});
