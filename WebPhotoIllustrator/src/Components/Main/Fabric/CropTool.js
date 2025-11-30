import React, { useState } from "react";

import { colors } from "@mui/material";
import { Button, Flex } from "blocksin-system";
import { Rect } from "fabric";
import { CropIcon, CheckIcon, Cross1Icon } from "sebikostudio-icons";

function CropTool({ canvas,showCropTool, cropRect,setCropRect,setShowCropTool }) {

    const applyCrop = () => {
        if (!canvas || !cropRect) return;

        // Получаем реальные размеры и позицию рамки
        const width = cropRect.getScaledWidth();
        const height = cropRect.getScaledHeight();
        const left = cropRect.left;
        const top = cropRect.top;

        // Удаляем рамку перед обрезкой, чтобы она не осталась на холсте
        canvas.remove(cropRect);

        // Смещаем все объекты так, чтобы левый верхний угол рамки стал (0,0)
        canvas.getObjects().forEach((obj) => {
            obj.set({
                left: obj.left - left,
                top: obj.top - top
            });
            obj.setCoords();
        });

        // Меняем размер самого холста
        canvas.setDimensions({ width: width, height: height });
        
        // Сбрасываем состояние
        setCropRect(null);
        setShowCropTool(false);
        canvas.renderAll();
    };

    const cancelCrop = () => {
        if (!canvas || !cropRect) return;
        canvas.remove(cropRect);
        canvas.renderAll();
        setCropRect(null);
        setShowCropTool(false);
    };

    return (
        <Flex className="Settings darkmode" direction="column" gap={100} style={{ padding: "10px",display:showCropTool?"flex":"none" }}>
                <Flex gap={50} style={{ marginTop: 10,color:"white",display:showCropTool?"flex":"none" }}>
                    <Button onClick={applyCrop} variant="primary" size="small" fullWidth>
                        <CheckIcon /> Apply
                    </Button>
                    <Button onClick={cancelCrop} variant="danger" size="small" fullWidth>
                        <Cross1Icon /> Cancel
                    </Button>
                </Flex>
        </Flex>
    );
}

export default CropTool;