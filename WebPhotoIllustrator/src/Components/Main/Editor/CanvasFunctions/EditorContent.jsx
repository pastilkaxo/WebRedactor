import React, { useEffect } from "react";
import { Canvas, Point } from "fabric";
import Tooltip from "@mui/material/Tooltip";

export default function EditorContent({
  canvasRef,
  fabricRef,
  setPointerCords,
  setZoom,
  handleToolClick,
  addRectangle
}) {
  const [isMobile, setIsMobile] = React.useState(false);
  const [isTablet, setIsTablet] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
      setIsTablet(width > 768 && width <= 1024);
      setIsDesktop(width > 1024);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const container = canvasRef.current.parentElement;

    // Инициализация canvas один раз
    if (!fabricRef.current) {
      const canvas = new Canvas(canvasRef.current, {
        backgroundColor: "white",
        selection: true,
        preserveObjectStacking: true
      });
      fabricRef.current = canvas;
    }

    const canvas = fabricRef.current;

    // ResizeObserver для масштабирования
    const resizeCanvas = () => {
      requestAnimationFrame(() => {
        if (!canvas || !canvasRef.current || !container) return;
        const { width, height } = container.getBoundingClientRect();
        if (width && height) {
          canvas.setWidth(width);
          canvas.setHeight(height);
          canvas.requestRenderAll();
        }
      });
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(container);
    resizeCanvas();

    // Zoom колесом мыши
    const handleMouseWheel = (e) => {
      e.e.preventDefault();
      let zoom = canvas.getZoom();
      zoom *= 0.999 ** e.e.deltaY;
      zoom = Math.min(Math.max(zoom, 0.01), 20);
      const point = new Point(e.e.offsetX, e.e.offsetY);
      canvas.zoomToPoint(point, zoom);
      setZoom(zoom);
    };

    // Pan мышью
    let isDragging = false;
    let lastPosX = 0;
    let lastPosY = 0;

    const handleMouseDown = (e) => {
      if (e.e.altKey || e.e.ctrlKey) {
        isDragging = true;
        canvas.selection = false;
        lastPosX = e.e.clientX;
        lastPosY = e.e.clientY;
        canvas.setCursor("grab");
      }
    };

    const handleMouseMove = (e) => {
      if (isDragging) {
        const vpt = canvas.viewportTransform;
        vpt[4] += e.e.clientX - lastPosX;
        vpt[5] += e.e.clientY - lastPosY;
        canvas.requestRenderAll();
        lastPosX = e.e.clientX;
        lastPosY = e.e.clientY;
        canvas.setCursor("grabbing");
      } else {
        const pointer = canvas.getPointer(e.e);
        setPointerCords({ x: Math.round(pointer.x), y: Math.round(pointer.y) });
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
      canvas.selection = true;
      canvas.setCursor("default");
    };

    const handleClearCords = () => setPointerCords({ x: 0, y: 0 });

    // Подписка на события
    canvas.on("mouse:wheel", handleMouseWheel);
    canvas.on("mouse:down", handleMouseDown);
    canvas.on("mouse:move", handleMouseMove);
    canvas.on("mouse:up", handleMouseUp);
    canvas.on("mouse:out", handleClearCords);

    return () => {
      resizeObserver.disconnect();
    };
  }, [canvasRef, fabricRef, setPointerCords, setZoom]);

  return (
    <div className="editor-content">
      <ul id="tool-actions">
        {[
          ["arrange", "Перемещение", addRectangle],
          ["selection", "Выделение", null],
          ["crop", "Обрезание", null],
          ["figures", "Фигура", null],
          ["eraser", "Ластик", null],
          ["cut", "Вырезать", null],
          ["fill", "Заливка", null],
          ["gradient", "Градиент", null],
          ["zoom", "Лупа", null],
          ["picker", "Пипетка", null],
          ["text", "Текст", null],
          ["pencil", "Карандаш", null],
          ["hand", "Рука", null],
          ["lasso", "Лассо", null]
        ].map(([tool, title, action]) => (
          <li key={tool} className="tool-action" onClick={() => { handleToolClick(tool); action && action(); }}>
            <Tooltip title={title} arrow>
              <img src={`/Images/EditorIcons/${tool}.png`} alt={tool} />
            </Tooltip>
          </li>
        ))}
        <li className="tool-action">
          <Tooltip title="Главный цвет" arrow>
            <input type="color" id="main-color" />
          </Tooltip>
        </li>
        <li className="tool-action">
          <Tooltip title="Вторичный цвет" arrow>
            <input type="color" id="secondary-color" defaultValue="#ffffff" />
          </Tooltip>
        </li>
      </ul>
      <div className="canvas-wrapper">
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
      </div>
    </div>
  );
}
