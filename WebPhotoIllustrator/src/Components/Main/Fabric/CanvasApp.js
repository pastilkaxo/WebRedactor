import { Canvas, Rect, Cirlce, Circle, } from 'fabric';
import React,{useRef,useState,useEffect} from 'react'
import { IconButton } from 'blocksin-system';
import {SquareIcon,CircleIcon} from "sebikostudio-icons"
import Settings from './Settings';
import Video from './Video';

export default function CanvasApp() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {
        width: 500,
        height: 500
      });
      initCanvas.backgroundColor = "#ffff";
      initCanvas.renderAll();
      setCanvas(initCanvas);

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
  
  return (
    <div className='CanvasApp'>
      <div className='Toolbar darkmode'>
        <IconButton onClick={addRectangle} variant="ghost" size="medium">
          <SquareIcon/>
        </IconButton>
        <IconButton onClick={addCircle} variant="ghost" size="medium">
          <CircleIcon/>
        </IconButton>
        <Video canvas={canvas} canvasRef={canvasRef}/>
      </div>
      <canvas id='canvas' ref={canvasRef} />
      <Settings canvas={canvas} />
    </div>
  )
}
