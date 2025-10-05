import * as FabricTools from './FabricTools.js';

export const toolsMap = {
  arrange: (canvas) => {},        // можно реализовать 
  selection: (canvas) => { FabricTools.disableDrawing(canvas); },
  crop: (canvas) => {},           // через меню
  figures: (canvas) => {},        // через меню
  eraser: (canvas) => FabricTools.enableEraser(canvas),
  cut: (canvas) => {},            // через меню
  fill: (canvas) => {},           // через меню
  gradient: (canvas) => {},       // через меню
  zoom: (canvas) => {},           // через меню
  picker: (canvas) => {},         // через меню
  text: (canvas) => {},           // через меню
  pencil: (canvas) => FabricTools.enablePencil(canvas),
  hand: (canvas) => {},           // через меню (pan)
  lasso: (canvas) => {}           // через меню (ActiveSelection)
};
