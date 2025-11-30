import React,{useState,useEffect} from "react"

import { Input, IconButton, Flex, Separator } from "blocksin-system"
import { 
    TextAlignLeftIcon, 
    TextAlignCenterIcon, 
    TextAlignRightIcon, 
    FontBoldIcon, 
    FontItalicIcon, 
    UnderlineIcon,
  StrikethroughIcon,
  OverlineIcon,
    TextAlignJustifyIcon
} from "sebikostudio-icons"


export default function Settings({ canvas }) {
  const [selectedObject, setSelectedObject] = useState(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [diameter, setDiameter] = useState("")
  const [color, setColor] = useState("")
  const [opacity, setOpacity] = useState("")
  const [strokeWidth, setStrokeWidth] = useState(5)

  // text styling

  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isLineThrough, setIsLinethrough] = useState(false);
  const [isOverline, setIsOverline] = useState(false);
  const [textAlign, setTextAlign] = useState("left");
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState("Arial");
  

  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (event) => {
        handleObjectSelection(event.selected[0]);
      })
      canvas.on("selection:updated", (event) => {
        handleObjectSelection(event.selected[0]);
      })
      canvas.on("selection:cleared", (event) => {
        setSelectedObject(null);
        clearSettings();
      })
      canvas.on("object:modified", (event) => {
        handleObjectSelection(event.target);
      }) 
      canvas.on("object:scaling", (event) => {
        handleObjectSelection(event.target);
      }) 
    }
  }, [canvas]);

  const handleObjectSelection = (object) => {
    if (!object) return
    setSelectedObject(object);
    setOpacity(object.opacity);
    switch (object.type) {
    case "rect":
      setWidth(Math.round(object.width * object.scaleX));
      setHeight(Math.round(object.height * object.scaleY));
      setColor(object.fill);
      setDiameter("");
      break;
    case "triangle":
      setWidth(Math.round(object.width * object.scaleX));
      setHeight(Math.round(object.height * object.scaleY));
      setColor(object.fill);
      break;
    case "circle":
      setWidth("");
      setHeight("");
      setColor(object.fill);
      setDiameter(Math.round(object.radius * 2 * object.scaleX));
      break;
    case "textbox":
        setColor(object.fill);
        setIsBold(object.fontWeight === "bold");
        setIsItalic(object.fontStyle === "italic");
        setIsUnderline(!!object.underline);
        setIsLinethrough(!!object.linethrough);
        setTextAlign(object.textAlign);
        setFontSize(object.fontSize);
        setIsOverline(object.overline);
        setFontFamily(object.fontFamily);
        break;
    case "line":
        setColor(object.stroke);
        setStrokeWidth(object.strokeWidth);
    break;
    default:
      break;
    }
  }

  const clearSettings = () => {
    setWidth("");
    setHeight("");
    setColor("");
    setDiameter("");
    setOpacity("");
    setStrokeWidth(5);
  }

  const handleWidthChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const initValue = parseInt(value, 10);

    setWidth(initValue);
    if (selectedObject && selectedObject.type === "rect" && initValue >= 0) {
      selectedObject.set({ width: initValue / selectedObject.scaleX });
      canvas.renderAll();
    }
  }

  const handleHeightChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const initValue = parseInt(value, 10);

    setHeight(initValue);
    if (selectedObject && selectedObject.type === "rect" && initValue >= 0) {
      selectedObject.set({ height: initValue / selectedObject.scaleY });
      canvas.renderAll();
    }
  }

  const handleDiameterChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const initValue = parseInt(value, 10);

    setDiameter(initValue);
    if (selectedObject && selectedObject.type === "circle" && initValue >= 0) {
      selectedObject.set({ radius: initValue / 2 / selectedObject.scaleX });
      canvas.renderAll();
    }
  }
  const handleColorChange = (e) => {
    const value = e.target.value;
    setColor(value);
    if (selectedObject) {
      selectedObject.set({ fill:value });
      canvas.renderAll();
    }
  }

  const handleStrokeWidthChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const initValue = parseInt(value, 10);

    setStrokeWidth(initValue);
    if (selectedObject && selectedObject.type === "line" && initValue >= 0) {
      selectedObject.set({ strokeWidth: initValue });
      canvas.renderAll();
    }
  }

  const handleOpacityChange = (e) => {
    const value = e.target.value;
    setOpacity(value);
    if (selectedObject) {
      selectedObject.set({ opacity:value });
      canvas.renderAll();
    }
  }

  const handleFontSizeChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const initValue = parseInt(value, 10);

    setFontSize(initValue);
    if (selectedObject && selectedObject.type === "textbox" && initValue >= 0) {
      selectedObject.set({ fontSize: initValue });
      canvas.renderAll();
    }
  }

  const toggleStyle = (prop,value,stateSetter) => {
    if (!selectedObject || !canvas) return;
    let newValue;
    if (value !== undefined) {
      newValue = value;
    }
    else {
      if (prop === "fontWeight") newValue = selectedObject.fontWeight === "bold" ? "normal" : "bold";
      if (prop === "fontStyle") newValue = selectedObject.fontStyle === "italic" ? "normal" : "italic";
      if (prop === "underline") newValue = !selectedObject.underline;
      if (prop === "linethrough") newValue = !selectedObject.linethrough;
      if (prop === "overline") newValue = !selectedObject.overline;
    }
    selectedObject.set(prop, newValue);
    canvas.renderAll();
    if (stateSetter) stateSetter(prev => !prev);
    if (prop === "textAlign") setTextAlign(newValue);
  }



  return (    
    <div className='Settings darkmode'>
      {selectedObject && selectedObject.type === "rect"  && (
        <>
          <Input fluid label="Width" value={width} onChange={handleWidthChange} placeholder="Enter the width"/>
          <Input fluid label="Height" value={height} onChange={handleHeightChange} placeholder="Enter the height"/>
        </>
      )}
      {selectedObject && selectedObject.type === "triangle"  && (
        <>
          <Input fluid label="Width" value={width} onChange={handleWidthChange} placeholder="Enter the width"/>
          <Input fluid label="Height" value={height} onChange={handleHeightChange} placeholder="Enter the height"/>
        </>
      )}
      {selectedObject && selectedObject.type === "circle" && (
        <>
          <Input fluid label="Diameter" value={diameter} onChange={handleDiameterChange} placeholder="Enter the diameter"/>
        </>
      )}
      {selectedObject && selectedObject.type === "textbox" && (
        <>
             <Flex gap={10} style={{marginBottom: 10, marginTop: 5,color:"white"}}>
                <IconButton size="small" variant={isBold ? "primary" : "ghost"} onClick={() => toggleStyle("fontWeight", undefined, setIsBold)}><FontBoldIcon/></IconButton>
                <IconButton size="small" variant={isItalic ? "primary" : "ghost"} onClick={() => toggleStyle("fontStyle", undefined, setIsItalic)}><FontItalicIcon/></IconButton>
                <IconButton size="small" variant={isUnderline ? "primary" : "ghost"} onClick={() => toggleStyle("underline", undefined, setIsUnderline)}><UnderlineIcon/></IconButton>
                <IconButton size="small" variant={isLineThrough ? "primary" : "ghost"} onClick={() => toggleStyle("linethrough", undefined, setIsLinethrough)}><StrikethroughIcon /></IconButton>
                <IconButton size="small" variant={isOverline ? "primary" : "ghost"} onClick={() => toggleStyle("overline", undefined, setIsOverline)}><OverlineIcon/></IconButton>
            </Flex>
            
            <label style={{color:"white", fontSize:12}}>Alignment</label>
            <Flex gap={10} style={{marginBottom: 10, marginTop: 5,color:"white"}}>
                <IconButton size="small" variant={textAlign === "left" ? "primary" : "ghost"} onClick={() => toggleStyle("textAlign", "left",setTextAlign)}><TextAlignLeftIcon/></IconButton>
                <IconButton size="small" variant={textAlign === "center" ? "primary" : "ghost"} onClick={() => toggleStyle("textAlign", "center",setTextAlign)}><TextAlignCenterIcon/></IconButton>
                <IconButton size="small" variant={textAlign === "right" ? "primary" : "ghost"} onClick={() => toggleStyle("textAlign", "right", setTextAlign)}><TextAlignRightIcon /></IconButton>
                <IconButton size="small" variant={textAlign === "justify" ? "primary" : "ghost"} onClick={() => toggleStyle("textAlign", "justify",setTextAlign)}><TextAlignJustifyIcon/></IconButton>
            </Flex>

            <Input fluid label="Font Size" type="number" value={fontSize} onChange={handleFontSizeChange} />
            <Separator />
        </>
      )}
      {selectedObject && selectedObject.type === "line" && (
        <>
          <Input fluid label="Stroke Width" value={strokeWidth} onChange={handleStrokeWidthChange} placeholder="Enter the width"/>
        </>
      )}
      {selectedObject && (
        <>
                  <input
          type="color"
          value={color}
          onChange={handleColorChange}
            style={{ border: "1px solid black", background: "white", width: "100%", height: "40px" }}
          />
          <Input fluid label="Opacity" type="number" value={opacity} onChange={handleOpacityChange} placeholder="Enter the opacity" step={0.01} min={0} max={1} />
        </>
        
      )}
      {/* {!selectedObject && (
          <p style={{color: '#888', textAlign: 'center', marginTop: 20}}>Select an object to edit properties</p>
      )} */}
    </div>
  )
}
