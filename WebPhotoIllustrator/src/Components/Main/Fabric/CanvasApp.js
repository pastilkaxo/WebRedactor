import React,{useRef,useState,useEffect} from "react"

import { IconButton } from "blocksin-system";
import { Canvas, Rect, Circle, Textbox,Triangle,Group,Line } from "fabric";
import {
  SquareIcon, CircleIcon, TextIcon,
  LayersIcon, SlashIcon, TriangleIcon, ImageIcon, UnionIcon, IntersectIcon,
  CropIcon, Pencil1Icon, ResetIcon, ReloadIcon
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
import EraserTool from "./EraserTool";
import { Link } from "react-router-dom";

export default function CanvasApp() {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);
  const [guidelines, setGuideLines] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showLayers, setShowLayers] = useState(true);
  const [showImageMenu, setShowImageMenu] = useState(false);
  const [showCropTool, setShowCropTool] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [cropRect, setCropRect] = useState(null);
  
  const isDragging = useRef(false);
  const lastPosX = useRef(0);
  const lastPosY = useRef(0);
  
  // State нужен только для обновления UI (активность кнопок), 
  // а Ref хранит актуальные данные для слушателей событий.
  const [historyIndex, setHistoryIndex] = useState(-1); // UI
  const historyRef = useRef([]);
  const historyIndexRef = useRef(-1);

  const isHistoryProcessing = useRef(false);


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
          "id",
          "name",
          "selectable",
          "evented"
        ]
      )
    }
  }


const groupSelectedObjects = () => {
  if (canvas) {
    const activeObjects = canvas.getActiveObjects();
    if (activeObjects.length > 1) {
      const group = new Group(activeObjects, {});
      activeObjects.forEach((obj) => {
        canvas.remove(obj);
      });
      canvas.add(group);
      canvas.setActiveObject(group);
      canvas.renderAll();
      saveHistory(canvas);
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
      saveHistory(canvas);
    }
  }
};
  
  const saveHistory = (c) => {
    if (isHistoryProcessing.current || !c) return;
    try {
      const json = c.toJSON(["id", "styleID", "zIndex", "name", "selectable", "evented"]);
      const currentHistory = historyRef.current;
      const currentIndex = historyIndexRef.current;

      let newHistory = currentHistory.slice(0, currentIndex + 1);
      newHistory.push(json);
      
      historyRef.current = newHistory;
      historyIndexRef.current = newHistory.length - 1;
      setHistoryIndex(historyIndexRef.current);
    }
    catch (err) {
      console.log("error save history:", err);
    }
  }

  const undo = async () => {
     if (isHistoryProcessing.current || historyIndexRef.current <= 0 || !canvas) return;
    
    isHistoryProcessing.current = true;
    const prevIndex = historyIndexRef.current - 1;
    const prevState = historyRef.current[prevIndex];

    try {
      await canvas.loadFromJSON(prevState);
      canvas.renderAll();
      historyIndexRef.current = prevIndex;
      setHistoryIndex(prevIndex);
    }
    catch (err) {
      console.log("error undo:", err);
    }
    finally {
      isHistoryProcessing.current = false
    }
  }

  const redo = async () => {
    if (isHistoryProcessing.current || historyIndexRef.current >= historyRef.current.length - 1 || !canvas) return;
    
    isHistoryProcessing.current = true;
    const nextIndex = historyIndexRef.current + 1;
    const nextState = historyRef.current[nextIndex];
    try {
      await canvas.loadFromJSON(nextState);
      canvas.renderAll();
      historyIndexRef.current = nextIndex;
      setHistoryIndex(nextIndex);
    }
    catch (err) {
      console.log("error undo:", err);
    }
    finally {
      isHistoryProcessing.current = false
    }
  }
 
  useEffect(() => {
    if (canvasRef.current) {
      const initCanvas = new Canvas(canvasRef.current, {  
        width: window.innerWidth - 300, // Пример: адаптивная ширина
        height: window.innerHeight,
      });
      initCanvas.backgroundColor = "#f0f0f0";
      initCanvas.renderAll();
      setCanvas(initCanvas);

      const initialJSON = initCanvas.toJSON(["id", "styleID", "zIndex", "selectable", "evented"]);
      historyRef.current = [initialJSON];
      historyIndexRef.current = 0;
      setHistoryIndex(0);


      initCanvas.on("object:added", (event) => { 
        extendObjectWithCustomProps(event.target);
        saveHistory(initCanvas);
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
        handleObjectMoving(initCanvas, event.target, guidelines, setGuideLines)
      });

      initCanvas.on("object:removed", () => {
        saveHistory(initCanvas);
      });

      initCanvas.on("object:modified", () => {
        clearGuideLines(initCanvas, guidelines, setGuideLines);
        saveHistory(initCanvas);
      });

        const handleKeyDown = (e) => {
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) {
            return;
        }
          

        if (e.key === 'Delete') {
            const activeObjects = initCanvas.getActiveObjects();
            const activeObject = initCanvas.getActiveObject();

            if (activeObject && activeObject.isEditing) {
                return;
            }

            if (activeObjects.length) {
                activeObjects.forEach((obj) => {
                    initCanvas.remove(obj);
                });
                
                initCanvas.discardActiveObject(); 
                initCanvas.requestRenderAll(); 
            }
        }
        };
      
      window.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        initCanvas.dispose();
      }
    }
  }, [])

  useEffect(() => {
    const handleShortcuts = (e) => {
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
        
        if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
            e.preventDefault();
            undo();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
            e.preventDefault();
            redo();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            e.preventDefault();
            copy();
        }
        if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
            e.preventDefault();
            paste();
        } 
    }
    window.addEventListener('keydown', handleShortcuts);
    return () => window.removeEventListener('keydown', handleShortcuts);
  }, [canvas]);

  const handleShowLayer = () => {
    showLayers ? setShowLayers(false) : setShowLayers(true);
  }

  const handleImageEditor = () => {
    !showImageMenu ? setShowImageMenu(true) : setShowImageMenu(false);
  }

  const handleShowCropTool = () => {
    showCropTool ? setShowCropTool(false) : (setShowCropTool(true), startCrop());
  }

  const toggleDrawing = () => {
        setIsDrawing(!isDrawing);
  };

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
  
  let _clipboard;


  const copy = () => {
    canvas.getActiveObject().clone().then((cloned) => {
      _clipboard = cloned;
    });
  }

  const paste = async () => {
    const clonedObj = await _clipboard.clone();
    canvas.discardActiveObject();
    clonedObj.set({
      left: clonedObj.left + 10,
      top: clonedObj.top + 10,
      evented: true,
    });
    if (clonedObj instanceof fabric.ActiveSelection) { 
      clonedObj.canvas = canvas;
      clonedObj.forEachObject(function(obj) {
        canvas.add(obj);
      });
      clonedObj.setCoords();
    }
    else {
      canvas.add(clonedObj);
    }
    _clipboard.top += 10;
    _clipboard.left += 10;
    canvas.setActiveObject(clonedObj);
    canvas.requestRenderAll();
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
        <IconButton onClick={toggleDrawing} variant="ghost" size="medium">
          <Pencil1Icon/>
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
        <div>
        </div>
      </div>
      <FabricAssist canvas={canvas}/>
      <canvas id='canvas' ref={canvasRef} />
      <div className="SettingsGroup">
        <Settings canvas={canvas} />
        <CropTool canvas={canvas} showCropTool={showCropTool} cropRect={cropRect} setCropRect={setCropRect} setShowCropTool={setShowCropTool} />
        <PensilTool canvas={canvas} isDrawing={isDrawing} setIsDrawing={setIsDrawing} toggleDrawing={toggleDrawing}/>
        <ImageTool canvas={canvas} showImageMenu={showImageMenu}  />
        <CanvasSettings canvas={canvas}/>
        <CroppingSettings canvas={canvas} refreshKey={refreshKey} />
        <LayersList canvas={canvas} showLayers={showLayers} />
        <StyleEditor canvas={canvas}/>
      </div>
    </div>
  )
}