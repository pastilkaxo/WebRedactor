import React,{useRef,useState,useEffect} from "react"

import { IconButton } from "blocksin-system";
import { Canvas, Rect, Circle, Textbox,Triangle,Group,Line } from "fabric";
import {
  SquareIcon, CircleIcon, TextIcon,
  LayersIcon, SlashIcon, TriangleIcon, ImageIcon, UnionIcon, IntersectIcon,
  CropIcon
} from "sebikostudio-icons"

import CanvasSettings from "./CanvasSettings";
import Cropping from "./Cropping";
import CroppingSettings from "./CroppingSettings";
import Settings from "./Settings";
import { handleObjectMoving, clearGuideLines } from "./snappingHelpers";
import Video from "./Video";
import LayersList from "./LayersList";
import FabricAssist from "./fabricAssist";
import StyleEditor from "./StyleEditor";
import FileExport from "./FileExport";
import ZoomControl from "./ZoomControl";
import ImageTool from "./ImageFromUrl";
import CropTool from "./CropTool";
import PensilTool from "./PencilTool";
import { Link } from "react-router-dom";

export default function CanvasApp() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [guidelines, setGuideLines] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showLayers, setShowLayers] = useState(true);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [showCropTool, setShowCropTool] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [cropRect, setCropRect] = useState(null);
  
  const isDragging = useRef(false);
  const lastPosX = useRef(0);
  const lastPosY = useRef(0);

  const extendObjectWithCustomProps = (object) => {
    object.styleID = object.styleID || null;
    object.zIndex = object.zIndex || 0;
    object.id = object.id || `obj-${Date.now()}`;

    const originalToObject = object.toObject;
    object.toObject = function (propertiesToInclude = []) {
      return originalToObject.call(this,[
          ...propertiesToInclude,
          "styleID",
          "zindex",
          "id"
        ]
      )
    }
  }


const groupSelectedObjects = () => {
  if (canvas) {
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 1) {
      const group = new Group(activeObjects, {});
      canvas.discardActiveObject(); 
      canvas.add(group);
      
      canvas.renderAll();
    }
  }
};

const ungroupSelectedObjects = () => {
  if (canvas) {
    const activeObject = canvas.getActiveObject();
    if (activeObject && activeObject.type === 'group') {
      const children = activeObject.removeAll();
      
      canvas.remove(activeObject);

      canvas.add(...children); 
      
      canvas.discardActiveObject();
      
      canvas.requestRenderAll(); 
    }
  }
};
 
  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {  
        width: window.innerWidth - 300, // Пример: адаптивная ширина
        height: window.innerHeight,
      });
      initCanvas.backgroundColor = "#f0f0f0";
      initCanvas.renderAll();
      setCanvas(initCanvas);


      initCanvas.on("object:added", (event) => { 
        extendObjectWithCustomProps(event.target);
      });

      initCanvas.on('mouse:wheel', function(opt) {
        if (opt.e.ctrlKey) {
            var delta = opt.e.deltaY;
            var zoom = initCanvas.getZoom();
            zoom *= 0.999 ** delta;
            if (zoom > 5) zoom = 5;
            if (zoom < 0.1) zoom = 0.1;
            
            initCanvas.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);
            setZoom(Math.round(zoom * 100));
            
            opt.e.preventDefault();
            opt.e.stopPropagation();
        }
      });


      initCanvas.on('mouse:down', function (opt) {
        const evt = opt.e;
        // Проверяем зажат ли Ctrl (или Alt, если хотите)
        if (evt.ctrlKey) {
          isDragging.current = true; // Пишем в ref
          initCanvas.selection = false; // Отключаем выделение объектов
          initCanvas.defaultCursor = 'grab'; // Меняем курсор для красоты
          lastPosX.current = evt.clientX; // Запоминаем X
          lastPosY.current = evt.clientY; // Запоминаем Y
        }
      });
      

      initCanvas.on('mouse:move', function(opt) {
        if (isDragging.current) {
          const e = opt.e;
          const vpt = initCanvas.viewportTransform;
          
          // Вычисляем смещение и обновляем vpt (матрицу вида)
          // vpt[4] - это translateX, vpt[5] - это translateY
          vpt[4] += e.clientX - lastPosX.current;
          vpt[5] += e.clientY - lastPosY.current;
          
          initCanvas.requestRenderAll(); // Перерисовываем
          
          // Обновляем последние координаты
          lastPosX.current = e.clientX;
          lastPosY.current = e.clientY;
        }
      });

      initCanvas.on('mouse:up', function(opt) {
        if (isDragging.current) {
            initCanvas.setViewportTransform(initCanvas.viewportTransform);
            isDragging.current = false;
            initCanvas.selection = true; // Возвращаем возможность выделения
            initCanvas.defaultCursor = 'default'; // Возвращаем курсор
        }
      });


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

  const handleShowLayer = () => {
    showLayers ? setShowLayers(false) : setShowLayers(true);
  }

  const handleImageEditor = () => {
    !showImageMenu ? setShowImageMenu(true) : setShowImageMenu(false);
  }

  const handleShowCropTool = () => {
    showCropTool ? setShowCropTool(false) : (setShowCropTool(true), startCrop());
  }

      const startCrop = () => {
          if (!canvas) return;
  
          const rect = new Rect({
              left: 50,
              top: 50,
              width: 200,
              height: 200,
              fill: 'rgba(0,0,0,0.3)',
              stroke: '#fff',
              strokeWidth: 2,
              strokeDashArray: [5, 5],
              cornerColor: 'white',
              cornerStrokeColor: 'black',
              borderColor: 'white',
              cornerStyle: 'circle',
              transparentCorners: false,
              name: 'crop-mask'
          });
  
          canvas.add(rect);
          canvas.setActiveObject(rect);
          canvas.renderAll();
          
          setCropRect(rect);
      };

  const addLine = () => {
    if (canvas) {
      const line = new Line([50, 50, 200, 50], {
        left: 170,
        top: 150,
        stroke: '#000000',
        strokeWidth: 5,
      });
      canvas.add(line);
    }
   }
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
  const addTriangle = () => {
    if (canvas) {
      const trgl = new Triangle({
        top: 150,
        left: 200,
        width: 100,
        height: 100,
        fill: "#FFC107"
      })
      canvas.add(trgl);
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

    const addText = () => {
    if (canvas) {
      const textbox = new Textbox(
        "Text",{
          top: 150,
          left: 150,
          width: 200,
          fontSize:20,
          fill: "#333",
          lockScalingFlip: true,
          editable: true,
          lockSclingX: false,
          lockScalingY: false,
          fontFamily: "OpenSans",
          textAlign: "left",
        
        
      })
      canvas.add(textbox);
    }
  }



  const handleFramesUpdated = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  }
  
  return (
    <div className='CanvasApp'>
      <div className='Toolbar darkmode'>
        <Cropping canvas={canvas} onFrameUpdated={handleFramesUpdated} />
        <IconButton onClick={handleShowCropTool} variant="ghost" size="medium">
          <CropIcon/>
        </IconButton>
        <Video canvas={canvas} canvasRef={canvasRef}/>
        <IconButton onClick={addRectangle} variant="ghost" size="medium">
          <SquareIcon/>
        </IconButton>
        <IconButton onClick={addCircle} variant="ghost" size="medium">
          <CircleIcon/>
        </IconButton>
        <IconButton onClick={addTriangle} variant="ghost" size="medium">
          <TriangleIcon/>
        </IconButton>
        <IconButton onClick={addLine} variant="ghost" size="medium">
          <SlashIcon/>
        </IconButton>
        <IconButton onClick={groupSelectedObjects} variant="ghost" size="medium">
          <UnionIcon/>
        </IconButton>
        <IconButton onClick={ungroupSelectedObjects} variant="ghost" size="medium">
          <IntersectIcon/>
        </IconButton>
        <IconButton onClick={addText} variant="ghost" size="medium">
          <TextIcon/>
        </IconButton>
        <IconButton onClick={handleImageEditor} variant="ghost" size="medium">
          <ImageIcon/>
        </IconButton>
        <IconButton onClick={handleShowLayer} variant="ghost" size="medium">
          <LayersIcon/>
        </IconButton>
      </div>
      <div className="TopNavBar darkmode">
        <Link to="/">
          <img src="./Images/logo.png" alt="logo" width={50}/>
        </Link>
        <FileExport canvas={canvas} />
        <ZoomControl canvas={canvas} zoom={zoom} setZoom={setZoom} />
      </div>
      <FabricAssist canvas={canvas}/>
      <canvas id='canvas' ref={canvasRef} />
      <div className="SettingsGroup">
        <Settings canvas={canvas} />
        <CropTool canvas={canvas} showCropTool={showCropTool} cropRect={cropRect} setCropRect={setCropRect} setShowCropTool={setShowCropTool} />
        <PensilTool canvas={canvas} />
        <ImageTool canvas={canvas} showImageMenu={showImageMenu}  />
        <CanvasSettings canvas={canvas}/>
        <CroppingSettings canvas={canvas} refreshKey={refreshKey} />
        <LayersList canvas={canvas} showLayers={showLayers} />
        <StyleEditor canvas={canvas}/>
      </div>
    </div>
  )
}