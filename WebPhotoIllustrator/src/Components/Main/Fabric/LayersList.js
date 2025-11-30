import React,{useEffect,useState} from "react"

import { IconButton,Flex } from "blocksin-system";
import { Canvas } from "fabric";
import { ArrowUpIcon, ArrowDownIcon,EyeClosedIcon,EyeOpenIcon,    LockClosedIcon, 
    LockOpen2Icon } from "sebikostudio-icons"

function LayersList({canvas,showLayers}) {
    const [layers, setLayers] = useState([]);
    const [selectedLayer, setSelectedLayer] = useState(null);


    const hideSelectedLayer = () => {
        if (!selectedLayer) return;

        const object = canvas.getObjects().find((obj) => obj.id === selectedLayer.id);
        if (!object) return;

        if (object.opacity === 0) {
            object.opacity = object.prevOpacity || 1;
            object.prevOpacity = undefined;
        }
        else {
            object.prevOpacity = object.opacity || 1;
            object.opacity = 0;
        }
        canvas.renderAll();
        updateLayers();
        setSelectedLayer({ ...selectedLayer, opacity: object.opacity });
    }

    const lockSelectedLayer = () => { 
        if (!selectedLayer) return;
        const object = canvas.getObjects().find((obj) => obj.id === selectedLayer.id);
        if (!object) return;
        const shouldLock = object.selectable;
        object.set({
            selectable: !shouldLock,
            evented: !shouldLock,
            lockMovementX: shouldLock,
            lockMovementY: shouldLock,
            lockRotation: shouldLock,
            lockScalingX: shouldLock,
            lockScalingY: shouldLock
        })
        if(shouldLock){
           canvas.discardActiveObject();
        }
        else {
            setSelectedLayer({ ...selectedLayer, locked: false });
        }
        canvas.renderAll();
        updateLayers();
    }

    const moveSelectedLayer = (direction) => {
        if (!selectedLayer) return;
        const objects = canvas.getObjects();
        const object = objects.find((obj) => obj.id === selectedLayer.id);

        if (object) {
            const currentIndex = objects.indexOf(object);

            if (direction === "up" && currentIndex < objects.length - 1) {
                const temp = objects[currentIndex];
                objects[currentIndex] = objects[currentIndex + 1];
                objects[currentIndex + 1] = temp;
            }
            else if (direction === "down" && currentIndex > 0) {
                const temp = objects[currentIndex];
                objects[currentIndex] = objects[currentIndex - 1];
                objects[currentIndex - 1] = temp;
            }


            const backgroundColor = canvas.backgroundColor;
            canvas.clear();
            objects.forEach((obj) => {
                canvas.add(obj);
            });
            canvas.backgroundColor = backgroundColor;
            canvas.renderAll();
            objects.forEach((obj, index) => {
                obj.zIndex = index;
            })

            canvas.setActiveObject(object);
            canvas.renderAll();

            updateLayers();
        }
    }

    const addIdToObject = (object) => {
        if (!object.id) {
            const timestamp = new Date().getTime();
            object.id = `${object.type}_${timestamp}`;
        }
    }

    Canvas.prototype.updateZIndices = function () {
        const objects = this.getObjects();
        objects.forEach((object,index) => {
            addIdToObject(object);
            object.zIndex = index;
        });
    }

    const updateLayers = () => {
        if (canvas) {
            canvas.updateZIndices();
            const objects = canvas
                .getObjects()
                .filter((obj) => obj.id && !(
                    obj.id.startsWith("vertical-") || obj.id.startsWith("horizontal-")
                )).map((obj) => ({
                    id: obj.id,
                    zIndex: obj.zIndex,
                    type: obj.type,
                    opacity: obj.opacity,
                    locked: !obj.selectable
                }));
            console.log("Filtered layers:", objects);
            setLayers([...objects].reverse());
        }
    }

    const handleObjectSelected = (e) => {
        const selectedObject = e.selected ? e.selected[0] : null;
        if (selectedObject) {
            setSelectedLayer({id:selectedObject.id, opacity:selectedObject.opacity, locked: !selectedObject.selectable});
        }
        else {
            setSelectedLayer(null);
        }
    }

    const selectLayerInCanvas = (layerId) => {
        const object = canvas.getObjects().find((obj) => obj.id === layerId);
        if (object) {
            canvas.setActiveObject(object);
            canvas.renderAll();

            setSelectedLayer({
                id: object.id, 
                opacity: object.opacity,
                locked: !object.selectable
            });
        }
    }

    useEffect(() => {
        if (canvas) {
            canvas.on("object:added", updateLayers);
            canvas.on("object:removed", updateLayers);
            canvas.on("object:modified", updateLayers);

            canvas.on("selection:created", handleObjectSelected);
            canvas.on("selection:updated", handleObjectSelected);
            canvas.on("selection:cleared", ()=> setSelectedLayer(null));

            updateLayers();
            return () => {
                canvas.off("object:added", updateLayers);
                canvas.off("object:removed", updateLayers);
                canvas.off("object:modified", updateLayers);
                canvas.off("selection:created", handleObjectSelected);
                canvas.off("selection:updated", handleObjectSelected);
                canvas.off("selection:cleared", ()=> setSelectedLayer(null));
            }
        }
    },[canvas])

  return (
      <div className='layersList CanvasSettings darkmode' style={showLayers ? {display:"flex"} : {display:"none"}}>
          <Flex fluid justify="start" style={{marginBottom:16}} gap={100}>
              <IconButton size='small' onClick={() => moveSelectedLayer("up")} disabled={!selectedLayer || layers[0]?.id === selectedLayer.id}> 
                  <ArrowUpIcon/>
              </IconButton>
              <IconButton size='small' onClick={() => moveSelectedLayer("down")} disabled={!selectedLayer || layers[layers.length - 1]?.id === selectedLayer.id}> 
                  <ArrowDownIcon/>
              </IconButton> 
              <IconButton size="small" onClick={hideSelectedLayer} disabled={!selectedLayer}>
                  {selectedLayer?.opacity === 0 ? <EyeClosedIcon/> : <EyeOpenIcon/>}
              </IconButton>
                <IconButton size="small" onClick={lockSelectedLayer} disabled={!selectedLayer}>
                  {selectedLayer?.locked ? <LockClosedIcon/> : <LockOpen2Icon/>}
              </IconButton>
          </Flex>
          <ul>
              {layers.length === 0 ? (<p style={{color:"white", textAlign:"center"}}>No objects</p>) : null}
              {layers.map((layer) => (
                <li key={layer.id} onClick={()=> selectLayerInCanvas(layer.id)} className={selectedLayer && layer.id === selectedLayer.id ? "selected-layer" : ""}>
                     {layer.type} {layer.zIndex}  <span style={{marginRight: 5}}>{layer.locked && "🔒"}</span>
                </li>
            ))}    
        </ul>      
    </div>
  )
}

export default LayersList