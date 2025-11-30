import React,{useState,useRef, useEffect} from "react"

import { Button, Flex, Paragraph, Heading, Separator } from "blocksin-system";
 

function StyleEditor({ canvas }) {
    const [colors, setColors] = useState([]);
    const [newColor, setNewColor] = useState("#ffff");
    const colorInputRef = useRef(null);

    useEffect(() => {
        const savedStyles = JSON.parse(localStorage.getItem("canvasStyles")) || [];
        setColors(savedStyles);
    },[])

    const addColor = () => {
        if (colors.length > 5) return;
        const id = `color${Date.now()}`;
        const updatedColors = [...colors, { id, color: newColor }];
        setColors(updatedColors);
    }

    const openColorPicker = () => {
        colorInputRef.current.click();
    }

    const saveColors = () => {
        localStorage.setItem("canvasStyles", JSON.stringify(colors));
        canvas?.getObjects().forEach((object) => {
            const objectStyleID = object.get("styleID");
            const colorToUpdate = colors.find((color) => color.id === objectStyleID);
            if (colorToUpdate && object.get("fill") !== colorToUpdate.color) {
                object.set("fill", colorToUpdate.color);
            }
        });
        canvas.renderAll();
    }

    const applyStyle = (color, id) => {
        const activeObject = canvas?.getActiveObject();
        if (activeObject) {
            activeObject.set("fill", color);
            activeObject.set("styleID", id);
            canvas.renderAll();
        }
    }

    const updateColor = (id, newColor) => {
        const updatedColors = colors.map((item) =>
            item.id === id ? { ...item, color: newColor } : item
        );
        setColors(updatedColors);
    };

    const openColorPickerById = (id) => {
        document.getElementById(`color-${id}`)?.click();
    }



    return (
        <>
        <Flex direction="column" className="StyleEditor CanvasSettings darkmode" style={{color:"white",fontWeight:"800",fontFamily:"Open Sans"}}>
                <input
                    ref={colorInputRef}
                    type='color'
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    style={{pointerEvents:"none",width:0, height:0, opacity:0}}
                />
                <Heading level={4} weight="bold">Style Editor</Heading>
                <Flex gap={100}>
                    <div className='colorBox' style={{ backgroundColor: newColor }} onClick={openColorPicker}>
                    </div>
                    <Button size="small" variant="outline" onClick={addColor}>
                        Add Color
                    </Button>
                </Flex>
                <Separator />
                    <Flex wrap="wrap" fluid gap={100} justify="start">
                        {colors.map(({ id, color }) => (
                            <div
                                key={id}
                                style={{
                                    backgroundColor: color,
                                    fontSize: 10,
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}
                                onClick={() => applyStyle(color, id)}
                                className="colorBox"
                            >
                                Apply
                            </div>
                        ))}
                    </Flex>
                <Separator />
                <Heading level={4} weight="bold">Edit Styles</Heading>
                <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                    <Flex direction="column" gap={100} className="ColorList">
                        {colors.map(({ id, color }) => (
                            <Flex key={id} align="center">
                                <input
                                    id={`color-${id}`}
                                    style={{ pointerEvents: "none", opacity: 0, width: 0, height: 0 }}
                                    type="color"
                                    value={color}
                                    onChange={(e) => updateColor(id, e.target.value)}
                                />
                                <Flex gap={100} align="center">
                                    <div
                                        className="colorBox"
                                        style={{ backgroundColor: color }}
                                        onClick={() => openColorPickerById(id)}
                                    />
                                    <input
                                        type="text"
                                        value={color}
                                        onChange={(e) => updateColor(id, e.target.value)}
                                    />
                                    <Paragraph size="small" style={{textAlign:"center"}}>{id}</Paragraph>
                                </Flex>
                            </Flex>
                        ))}
                    </Flex>
                </div>
                <Separator />
                <Button size="small" fluid onClick={saveColors}> 
                    Save Colors
                </Button>
        </Flex>
        </>
  )
}

export default StyleEditor