import React from 'react'
import Link from '@mui/material/Link'

export default function EditorNavBar() {
  return (
 <div className="container-fluid">
    <div className="offcanvas offcanvas-end text-bg-white" tabIndex={-1} id="editorNavBar" aria-labelledby="offcanvasDarkNavbarLabel">
      <div className="offcanvas-header">
            <Link className="nav-link text-white" to="/">
              <img className="logoIcon offcamvas-title" src="/Images/dark-logo.png" alt="logo" />
            </Link>
        <button type="button" className="btn-close btn-close-dark" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div className="offcanvas-body editor-offcanvas">
        <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
          <li className="nav-item">Файл</li>
          <li className="nav-item">Редактировать</li>
          <li className="nav-item">Изображение</li>
        <li className="nav-item">Помощь</li>
        <li className='nav-item' style={{color:"red"}}>Сохранить изображение</li>
        </ul>
      </div>
    </div>
  </div>
  )
}
