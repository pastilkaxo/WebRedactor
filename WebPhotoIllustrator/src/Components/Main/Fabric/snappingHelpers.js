import { Line } from "fabric";

const snappingDistance = 10;

export const handleObjectMoving = (canvas, obj, guidelines, setGuideLines) => {
    // 1. Получаем параметры Viewport (трансформации экрана)
    const vpt = canvas.viewportTransform;
    const zoom = canvas.getZoom();
    const canvasWidth = canvas.width;  // Ширина HTML-элемента canvas (экрана)
    const canvasHeight = canvas.height; // Высота HTML-элемента canvas (экрана)

    // 2. Рассчитываем координаты КРАЕВ ВИДИМОГО ЭКРАНА в координатах "мира"
    // Формула: (Координата экрана - Сдвиг) / Масштаб
    
    const viewportLeft = (0 - vpt[4]) / vpt[0];
    const viewportTop = (0 - vpt[5]) / vpt[3];
    const viewportRight = (canvasWidth - vpt[4]) / vpt[0];
    const viewportBottom = (canvasHeight - vpt[5]) / vpt[3];
    
    const viewportCenterX = (canvasWidth / 2 - vpt[4]) / vpt[0];
    const viewportCenterY = (canvasHeight / 2 - vpt[5]) / vpt[3];

    // 3. Дистанция с учетом зума
    const dist = snappingDistance / zoom;

    // 4. Координаты объекта
    const objWidth = obj.width * obj.scaleX;
    const objHeight = obj.height * obj.scaleY;
    
    const left = obj.left;
    const right = left + objWidth;
    const centerX = left + objWidth / 2;

    const top = obj.top;
    const bottom = top + objHeight;
    const centerY = top + objHeight / 2;

    let newGuideLines = [];
    clearGuideLines(canvas); 
    let snapped = false;

    // ============================
    // ВЕРТИКАЛЬНЫЕ ПРИВЯЗКИ (X)
    // ============================

    // 1. ЛЕВЫЙ край ЭКРАНА (Viewport Left)
    // Магнитим левую сторону объекта к левой стороне экрана
    if (Math.abs(left - viewportLeft) < dist) {
        obj.set({ left: viewportLeft });
        if (!guidelineExists(canvas, "vertical-left")) {
            newGuideLines.push(createVerticalGuideline(canvas, viewportLeft, "vertical-left"));
            canvas.add(newGuideLines[newGuideLines.length - 1]);
        }
        snapped = true;
    }

    // 2. ПРАВЫЙ край ЭКРАНА (Viewport Right)
    // Магнитим правую сторону объекта к правой стороне экрана
    if (Math.abs(right - viewportRight) < dist) {
        obj.set({ left: viewportRight - objWidth });
        if (!guidelineExists(canvas, "vertical-right")) {
            newGuideLines.push(createVerticalGuideline(canvas, viewportRight, "vertical-right"));
            canvas.add(newGuideLines[newGuideLines.length - 1]);
        }
        snapped = true;
    }

    // 3. ЦЕНТР ЭКРАНА (Viewport Center)
    if (Math.abs(centerX - viewportCenterX) < dist) {
        obj.set({ left: viewportCenterX - objWidth / 2 });
        if (!guidelineExists(canvas, "vertical-center")) {
            newGuideLines.push(createVerticalGuideline(canvas, viewportCenterX, "vertical-center"));
            canvas.add(newGuideLines[newGuideLines.length - 1]);
        }
        snapped = true;
    }

    // ============================
    // ГОРИЗОНТАЛЬНЫЕ ПРИВЯЗКИ (Y)
    // ============================

    // 1. ВЕРХНИЙ край ЭКРАНА (Viewport Top)
    if (Math.abs(top - viewportTop) < dist) {
        obj.set({ top: viewportTop });
        if (!guidelineExists(canvas, "horizontal-top")) {
            newGuideLines.push(createHorizontalGuideline(canvas, viewportTop, "horizontal-top"));
            canvas.add(newGuideLines[newGuideLines.length - 1]);
        }
        snapped = true;
    }

    // 2. НИЖНИЙ край ЭКРАНА (Viewport Bottom)
    if (Math.abs(bottom - viewportBottom) < dist) {
        obj.set({ top: viewportBottom - objHeight });
        if (!guidelineExists(canvas, "horizontal-bottom")) {
            newGuideLines.push(createHorizontalGuideline(canvas, viewportBottom, "horizontal-bottom"));
            canvas.add(newGuideLines[newGuideLines.length - 1]);
        }
        snapped = true;
    }

    // 3. ЦЕНТР ЭКРАНА (Viewport Center)
    if (Math.abs(centerY - viewportCenterY) < dist) {
        obj.set({ top: viewportCenterY - objHeight / 2 });
        if (!guidelineExists(canvas, "horizontal-center")) {
            newGuideLines.push(createHorizontalGuideline(canvas, viewportCenterY, "horizontal-center"));
            canvas.add(newGuideLines[newGuideLines.length - 1]);
        }
        snapped = true;
    }

    if (!snapped) {
        clearGuideLines(canvas);
    } else {
        setGuideLines(newGuideLines);
    }

    canvas.renderAll();
};

// --- Вспомогательные функции (ОБЯЗАТЕЛЬНО НУЖНЫ ТЕ, ЧТО БЫЛИ РАНЬШЕ) ---

const getVisibleBounds = (canvas) => {
    const vpt = canvas.viewportTransform;
    // Инвертируем матрицу для получения координат мира
    const top = (0 - vpt[5]) / vpt[3];
    const bottom = (canvas.height - vpt[5]) / vpt[3];
    const left = (0 - vpt[4]) / vpt[0];
    const right = (canvas.width - vpt[4]) / vpt[0];
    
    // Большой запас, чтобы линии казались бесконечными
    const padding = 5000 / vpt[0]; 

    return { 
        top: top - padding, 
        bottom: bottom + padding, 
        left: left - padding, 
        right: right + padding 
    };
};

export const createVerticalGuideline = (canvas, x, id) => {
    const bounds = getVisibleBounds(canvas);
    return new Line([x, bounds.top, x, bounds.bottom], {
        id,
        stroke: "red",
        strokeWidth: 1 / canvas.getZoom(),
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5],
        opacity: 0.8,
    });
};

export const createHorizontalGuideline = (canvas, y, id) => {
    const bounds = getVisibleBounds(canvas);
    return new Line([bounds.left, y, bounds.right, y], {
        id,
        stroke: "red",
        strokeWidth: 1 / canvas.getZoom(),
        selectable: false,
        evented: false,
        strokeDashArray: [5, 5],
        opacity: 0.8,
    });
};

export const clearGuideLines = (canvas) => {
    const objects = canvas.getObjects("line");
    objects.forEach((obj) => {
        if (
            (obj.id && obj.id.startsWith("vertical-")) ||
            (obj.id && obj.id.startsWith("horizontal-"))
        ) {
            canvas.remove(obj);
        }
    });
};

const guidelineExists = (canvas, id) => {
    const objects = canvas.getObjects("line");
    return objects.some((obj) => obj.id === id);
};