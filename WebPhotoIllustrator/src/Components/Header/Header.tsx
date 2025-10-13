import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import NavBar from './NavBar'

function Header() {
  const location = useLocation();
  const isEditorPage = location.pathname === '/editor';

  if (isEditorPage) {
    return null;
  }

  return (
    <aside className="app-sidebar">
      <nav className="nav navbar flex-column">
        <Link className="nav-link aLink" to="/">
          <img className='logoIcon' src='/Images/logo.png' alt='logo' />
        </Link>
        <Link className="nav-link aLink aLink-mobile" to="/storage">
          <img className='homeIcon' src='/Images/catalog.png' alt='Catalog' />
        </Link>
        <Link className="nav-link aLink aLink-mobile" to="/editor">
         <img className='homeIcon' src='/Images/edit.png' alt='Create' />
        </Link>
        <Link className="nav-link aLink aLink-mobile" to="/profile">
           <img className='accountIcon ms-md-0 ms-auto' src='/Images/login.png' alt='login' />
        </Link>
        <img className='burgerIcon ms-md-0 ms-auto navbar-toggler' src='/Images/burger.png' alt='login' data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation" />
      </nav>
      <NavBar/>
    </aside>
  )
}

export default Header