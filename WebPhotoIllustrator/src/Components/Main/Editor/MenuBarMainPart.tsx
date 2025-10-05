import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';


export default function MenuBarMainPart() {
    const [openedMenu, setOpenedMenu] = React.useState<null | HTMLElement>(null);
    const open = Boolean(openedMenu);
    const handleClick = (event:React.MouseEvent<HTMLElement>) => {
        setOpenedMenu(event.currentTarget);
    }
    const handleClose = () => {
        setOpenedMenu(null);
    }


  return (
      <>
          <li className="tool-item tool-toggler">
              <Button
                  sx={{color:"white"}}
              id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Файл
          </Button>
                <Menu
        id="fade-menu"
        slotProps={{
          list: {
            'aria-labelledby': 'fade-button',
          },
        }}
        slots={{ transition: Fade }}
        anchorEl={openedMenu}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>My account</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
          </li>
          <li className="tool-item tool-toggler">
                            <Button
                  sx={{color:"white"}}
              id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        Редактировать
          </Button>
        </li>
          <li className="tool-item tool-toggler">
                                          <Button
                  sx={{color:"white"}}
              id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        Изображение
          </Button>
        </li>
          <li className="tool-item tool-toggler">
                                          <Button
                  sx={{color:"white"}}
              id="fade-button"
        aria-controls={open ? 'fade-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
      >
        Помощь
          </Button>
        </li>
      </>
  )
}
