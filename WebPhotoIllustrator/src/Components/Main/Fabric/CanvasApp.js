import React,{useRef,useState,useEffect} from "react"

import { IconButton } from "blocksin-system";
import { Canvas, Rect, Circle, } from "fabric";
import { SquareIcon, CircleIcon } from "sebikostudio-icons"

import CanvasSettings from "./CanvasSettings";
import Cropping from "./Cropping";
import CroppingSettings from "./CroppingSettings";
import Settings from "./Settings";
import { handleObjectMoving, clearGuideLines } from "./snappingHelpers";
import Video from "./Video";
import LayersList from "./LayersList";

export default function CanvasApp() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [hasVideo, setHasVideo] = useState(false);
  const [guidelines, setGuideLines] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 500,
        height: 500
      });
      initCanvas.backgroundColor = "#ffff";
      initCanvas.renderAll();
      setCanvas(initCanvas);

      initCanvas.on("object:moving", (event) => {
        handleObjectMoving(initCanvas,event.target,guidelines,setGuideLines)
      });

      initCanvas.on("object:modified", () => {
        clearGuideLines(initCanvas, guidelines, setGuideLines);
      });

      return () => {
        initCanvas.dispose();
      }
    }
  }, [])

  const addRectangle = () => {
    if (canvas) {
      const rect = new Rect({
        top: 100,
        left: 50,
        width: 100,
        height: 60,
        fill: "#D84D42"
      })

      canvas.add(rect);
    }
  }
  const addCircle = () => {
    if (canvas) {
      const circle = new Circle({
        top: 150,
        left: 150,
        radius: 50,
        fill:"#2F4DC6"
      })
      canvas.add(circle);
    }
  }

  const handleFramesUpdated = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  }
  
  return (
    <div className='CanvasApp'>
      <div className='Toolbar darkmode'>
        <Cropping canvas={canvas} onFrameUpdated={handleFramesUpdated} />
        <Video canvas={canvas} canvasRef={canvasRef}/>
        <IconButton onClick={addRectangle} variant="ghost" size="medium">
          <SquareIcon/>
        </IconButton>
        <IconButton onClick={addCircle} variant="ghost" size="medium">
          <CircleIcon/>
        </IconButton>
      </div>
      <canvas id='canvas' ref={canvasRef} />
      <div className="SettingsGroup">
        <Settings canvas={canvas} />
        <CanvasSettings canvas={canvas} />
        <CroppingSettings canvas={canvas} refreshKey={refreshKey} />
        <LayersList canvas={canvas}/>
      </div>
    </div>
  )
}