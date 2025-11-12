import React,{useState,useEffect} from "react"

import {Input} from "blocksin-system"

export default function Settings({ canvas }) {
  const [selectedObject, setSelectedObject] = useState(null);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [diameter, setDiameter] = useState("")
  const [color, setColor] = useState("")
  const [opacity, setOpacity] = useState("")
  

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
    case "circle":
      setWidth("");
      setHeight("");
      setColor(object.fill);
      setDiameter(Math.round(object.radius * 2 * object.scaleX));
      break;
    case "textbox":
        setColor(object.fill);
        
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

  const handleOpacityChange = (e) => {
    const value = e.target.value;
    setOpacity(value);
    if (selectedObject) {
      selectedObject.set({ opacity:value });
      canvas.renderAll();
    }
  }



  return (    
    <div className='Settings darkmode'>
      {selectedObject && selectedObject.type === "rect" && (
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
    </div>
  )
}
