import React, { useState, useEffect, use } from "react";

import { Button, Flex, Input, Separator } from "blocksin-system";
import { EraserBrush } from "fabric"; // Импорт кисти ластика из Fabric v6
import { EraserIcon } from "sebikostudio-icons"; 

function EraserTool({ canvas, isErasing  }) {
    const [width, setWidth] = useState(20);
    useEffect(() => {
        if (!canvas) return;
        if (isErasing) {
            canvas.isDrawingMode = true;
            const eraserBrush = new EraserBrush(canvas);
            eraserBrush.width = parseInt(width, 10) || 1;
            canvas.freeDrawingBrush = eraserBrush;
        }
    }, [isErasing, canvas]);
    
    useEffect(() => { 
        if (canvas && isErasing && canvas.freeDrawingBrush && canvas.freeDrawingBrush.type === "EraserBrush") { 
            canvas.freeDrawingBrush.width = parseInt(width, 10) || 1;   
        }

    }, [width, canvas, isErasing]);
    


  return (
        <Flex className='Settings darkmode' direction="column" gap={100} style={{ padding: "10px", color: "white", display: isErasing ? "flex" : "none" }}>
            <div style={{ marginTop: 10 }}>
                <label style={{ color: "white", fontSize: 12 }}>Eraser Size</label>
                <Input
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
  )
}

export default EraserTool