import React from 'react'
import {Button} from "blocksin-system"

function FileExport({ canvas }) {
    const exportCanvas = () => {
        if (!canvas) return;
        
        const json = canvas.toJSON();
        const blob = new Blob([JSON.stringify(json)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "canvas.json";
        link.click();
    }

    const importCanvas = (e) => {
        if (!canvas) return;
        const file = e.target.files[0];
        if (file && file.type === "application/json") {
            const reader = new FileReader();
            reader.onload = () => {
                try {
                    const json = JSON.parse(reader.result);
                    canvas?.clear();
                    canvas?.loadFromJSON(json, () => {
                         canvas.renderAll();
                    });
                }
                catch (err) {
                    console.error("Can't load canvas from json.",err);
                }
            }
            reader.readAsText(file);
        }
        else {
            alert("Upload a file!");
        }
    }

  return (
    <div className='FileExport'>
          <Button variant="ghost" size="small" onClick={exportCanvas}>Export Canvas</Button>
          <input type='file' accept='.json' onChange={importCanvas}/>
    </div>
  )
}

export default FileExport