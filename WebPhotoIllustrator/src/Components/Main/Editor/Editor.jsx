import React, { useEffect, useRef, useState } from 'react';
import EditorContent from './CanvasFunctions/EditorContent';
import { Canvas, Rect } from 'fabric';
import MenuBar from './EditorMenu/MenuBar';
import { toolsMap } from './ToolsMap';

export default function Editor() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [pointerCords, setPointerCords] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [selectedTool, setSelectedTool] = useState(null);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  
  // Обработчик клика по инструменту
const handleToolClick = (tool) => {
  setSelectedTool(tool);          
  setIsActionMenuOpen(true);      
  if (toolsMap[tool]) {
    toolsMap[tool](fabricRef.current);
  }
};


  const closeActionMenu = () => {
    setIsActionMenuOpen(false);
    setSelectedTool(null);
  };


  const addRectangle = () => {
    if (!fabricRef.current) return;

    const rect = new Rect({
      width: 100,
      height: 60,
      fill: 'blue',
      left: 150,
      top: 150,
    });
  fabricRef.current.add(rect);
  fabricRef.current.setActiveObject(rect);
  fabricRef.current.renderAll();
  };

  return (
    <div className="paint-wrapper">
      <MenuBar
        x={pointerCords.x}
        y={pointerCords.y}
        selectedTool={selectedTool}
        isActionMenuOpen={isActionMenuOpen}
        closeActionMenu={closeActionMenu}
        canvasRef={fabricRef}
      />
      <EditorContent
        canvasRef={canvasRef}
        fabricRef={fabricRef}
        setPointerCords={setPointerCords}
        zoom={zoom}
        setZoom={setZoom}
        addRectangle={addRectangle}
        handleToolClick={handleToolClick}
      />
    </div>
  );
}
