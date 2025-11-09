import React, { useState, useEffect } from 'react';
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box
} from '@mui/material';
import { DownloadIcon } from "sebikostudio-icons";

function CroppingSettings({ canvas, refreshKey }) {
  const [frames, setFrames] = useState([]);
  const [selectedFrame, setSelectedFrame] = useState(null);
  const [selectedValue, setSelectedValue] = useState('');

  const updateFrames = () => {
    if (canvas) {
      const framesFromCanvas = canvas.getObjects("rect").filter((obj) => {
        return obj.name && obj.name.startsWith("Frame");
      });

      setFrames(framesFromCanvas);

      if (framesFromCanvas.length > 0 && !selectedFrame) {
        setSelectedFrame(framesFromCanvas[0]);
        setSelectedValue(framesFromCanvas[0].name);
      }
    }
  };

  useEffect(() => {
    updateFrames();
  }, [canvas, refreshKey]);

  const handleFrameSelect = (event) => {
    const value = event.target.value;
    setSelectedValue(value);
    
    const selected = frames.find((frame) => frame.name === value);
    setSelectedFrame(selected);
    
    if (selected) {
      canvas.setActiveObject(selected);
      canvas.renderAll();
    }
  };

  const exportFrameAsPNG = () => {
    if (!selectedFrame) return;
    
    frames.forEach((frame) => {
      frame.set("visible", false);
    });
    
    selectedFrame.set({
      strokeWidth: 0,
      visible: true,
    });
    
    const dataURL = canvas.toDataURL({
      left: selectedFrame.left,
      top: selectedFrame.top,
      width: selectedFrame.width * selectedFrame.scaleX,
      height: selectedFrame.height * selectedFrame.scaleY,
      format: "png"
    });

    selectedFrame.set({
      strokeWidth: 1
    });
    
    frames.forEach((frame) => {
      frame.set("visible", true);
    });
    
    canvas.renderAll();

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `${selectedFrame.name}.png`;
    link.click();
  };

  return (
    <div className='CroppingSettings darkmode'>
      {frames.length > 0 && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="frame-select-label" sx={{color:"white"}}>Frames</InputLabel>
            <Select
              labelId="frame-select-label"
              value={selectedValue}
              label="Frames"
              onChange={handleFrameSelect}
              sx={{
                '& .MuiSelect-select': {
                  color: 'white'
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.46)'
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.4)'
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#1976d2'
                }
              }}
            >
              {frames.map((frame, index) => (
                <MenuItem 
                  key={index} 
                  value={frame.name}
                  sx={{ color: 'black' }}
                >
                  {frame.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button 
            variant="contained" 
            onClick={exportFrameAsPNG}
            startIcon={<DownloadIcon />}
            fullWidth
            sx={{
              backgroundColor: '#1976d2',
              '&:hover': {
                backgroundColor: '#1565c0'
              }
            }}
          >
            Export as PNG
          </Button>
        </Box>
      )}
    </div>
  );
}

export default CroppingSettings;