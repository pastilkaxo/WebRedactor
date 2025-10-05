import React, { useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import * as FabricTools from '../../FabricTools.js'

export default function Figures({ canvas }) {
  const [fillColor, setFillColor] = useState('#ff0000');

  const handleAddFigure = (type) => {
    if (!canvas) return;
    FabricTools.addFigure(canvas, type, { fill: fillColor });
  };

  const handleColorChange = (e) => {
    setFillColor(e.target.value);
    const active = canvas.getActiveObject();
    if (active) FabricTools.fillSelected(canvas, e.target.value);
  };

  return (
    <>
      <p className='mb-0 p-3'>Тип:</p>
      <ul className='action-list'>
        <Tooltip title="ПРЯМОУГОЛЬНИК" arrow>
          <li className='action-list-item' onClick={() => handleAddFigure('rect')}>
            <img src='/Images/EditorIcons/Figures/rectangle.png' alt="rectangle" />
          </li>
        </Tooltip>
        <Tooltip title="ОКРУЖНОСТЬ" arrow>
          <li className='action-list-item' onClick={() => handleAddFigure('circle')}>
            <img src='/Images/EditorIcons/Figures/circle.png' alt="circle" />
          </li>
        </Tooltip>
        <Tooltip title="ЛИНИЯ" arrow>
          <li className='action-list-item' onClick={() => handleAddFigure('line')}>
            <img src='/Images/EditorIcons/Figures/line.png' alt="line" />
          </li>
        </Tooltip>
      </ul>
      <p className='mb-0 p-2'>Заполнить:</p>
      <Tooltip title="Цвет фигуры" arrow>
        <input 
          type='color' 
          className='fill-color' 
          value={fillColor} 
          onChange={handleColorChange} 
        />
      </Tooltip>
    </>
  );
}
