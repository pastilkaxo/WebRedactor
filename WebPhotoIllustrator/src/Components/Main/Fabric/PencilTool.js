import React, { useState, useEffect } from "react";

import { Button, Flex, Input, Separator } from "blocksin-system";
import { PencilBrush } from "fabric";
import { Pencil1Icon } from "sebikostudio-icons"; // Предполагаемая иконка

function PencilTool({ canvas,isDrawing }) {
    
    const [color, setColor] = useState("#000000");
    const [width, setWidth] = useState(5);

    // Включение/выключение режима рисования
    useEffect(() => {
        if (!canvas) return;

        canvas.isDrawingMode = isDrawing;
        
        if (isDrawing) {
            // Создаем кисть 
            const brush = new PencilBrush(canvas);
            brush.color = color;
            brush.width = parseInt(width, 10);
            canvas.freeDrawingBrush = brush;
        }

        return () => {
            if (canvas) {
                canvas.isDrawingMode = false;
            }
        };
    }, [isDrawing, canvas]);

    // Обновление параметров кисти 
    useEffect(() => {
        if (canvas && canvas.freeDrawingBrush && isDrawing) {
            canvas.freeDrawingBrush.color = color;
            canvas.freeDrawingBrush.width = parseInt(width, 10);
        }
    }, [color, width, canvas, isDrawing]);

    return (
        <Flex className='Settings darkmode' direction="column" gap={100} style={{ padding: "10px",color:"white",display:isDrawing ?"flex":"none" }}>
                <div style={{ marginTop: 10 }}>
                     <label style={{ color: "white", fontSize: 12 }}>Brush Color</label>
                    <Flex gap={50} align="center" style={{ marginBottom: 10 }}>
                       
                        <input 
                            type="color" 
                            value={color} 
                            onChange={(e) => setColor(e.target.value)} 
                            style={{ width: "100%", height: 30, cursor: "pointer" }}
                        />
                    </Flex>

                    <Input
                        label="Brush Width"
                        type="number"
                        min="1"
                        max="100"
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                        fluid
                    />
                </div>
             <Separator />
        </Flex>
    );
}

export default PencilTool;