import { Rect, Circle, Line, PencilBrush } from "fabric";

// Добавление фигур по центру canvas
export function addFigure(canvas, type, options = {}) {
  const canvasWidth = canvas.getWidth();
  const canvasHeight = canvas.getHeight();

  let shape;
  switch (type) {
    case "rect":
      shape = new Rect({ width: 100, height: 60, ...options });
      break;
    case "circle":
      shape = new Circle({ radius: 50, ...options });
      break;
    case "line":
      shape = new Line([0, 0, 100, 0], { stroke: options.fill || "black", ...options });
      break;
    default:
      return;
  }

  shape.set({
    originX: "center",
    originY: "center",
    left: canvasWidth / 2,
    top: canvasHeight / 2
  });

  canvas.add(shape);
  canvas.setActiveObject(shape);
  canvas.requestRenderAll();
}

// Изменение заливки выбранного объекта
export function fillSelected(canvas, color) {
  const active = canvas.getActiveObject();
  if (!active) return;

  if (active.type === "line") {
    active.set({ stroke: color });
  } else {
    active.set({ fill: color });
  }
  canvas.requestRenderAll();
}

// Включение карандаша
export function enablePencil(canvas, color = "black", width = 2) {
  const brush = new PencilBrush(canvas);
  brush.color = color;
  brush.width = width;
  canvas.freeDrawingBrush = brush;
  canvas.isDrawingMode = true;
}

// Включение ластика (через PencilBrush с цветом фона)
export function enableEraser(canvas, backgroundColor = "#ffffff", width = 20) {
  const brush = new PencilBrush(canvas);
  brush.color = backgroundColor;
  brush.width = width;
  canvas.freeDrawingBrush = brush;
  canvas.isDrawingMode = true;
}

// Выключение рисования
export function disableDrawing(canvas) {
  canvas.isDrawingMode = false;
}
