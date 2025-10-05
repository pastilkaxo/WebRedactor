import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import LoginModal from './LoginModal'
import NavBar from './NavBar'
interface HeaderProps {
  logged: boolean;
}


function Header({logged}:HeaderProps) {
  const location = useLocation();
  const isEditorPage = location.pathname === '/editor';

  if (isEditorPage) {
    return null;
  }

  return (
    <div
      className="d-flex flex-md-column flex-row p-3 bg-success bg-gradient text-white"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        width: '120px', 
        zIndex: 1150, 
      }}
    >
      <ul className="main-menu nav navbar nav-pills flex-md-column flex-row mb-auto w-100 justify-content-center align-items-center">
      <li className='nav-item menu-togler'>
      <button className="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasDarkNavbar" aria-controls="offcanvasDarkNavbar" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
      </li>
      <li className="nav-item">
          <Link className=" nav-link text-white" to="/">
            <img className='logoIcon' src='/Images/logo.png' alt='logo' />
          </Link>
        </li>
        <li className="nav-item">
          <Link className="nav-link text-white" to="/">
            <img className='homeIcon' src='/Images/home.png' alt='Home' />
          </Link>
        </li>
        <li className='nav-item'>
          <Link className="nav-link text-white" to="/storage">
            <img className='homeIcon' src='/Images/catalog.png' alt='Catalog' />
          </Link>
        </li>
        <li className='nav-item'>
          <Link className="nav-link text-white" to="/editor">
            <img className='homeIcon' src='/Images/edit.png' alt='Create' />
          </Link>
        </li>
        <li className='nav-item'>
          {logged ? 
            <Link className="nav-link text-white" to="/profile">
              <img className='accountIcon ms-md-0 ms-auto' src='/Images/login.png' alt='login' />
            </Link>
            :
        <img className='accountIcon ms-md-0 ms-auto' src='/Images/login.png' alt='login' data-bs-toggle="modal" data-bs-target="#loginModal" />    
        }
        </li>
      </ul>
      <div className='adaptive-logo'>
      <Link className="nav-link text-white" to="/">
            <img className='logoIcon' src='/Images/logo.png' alt='logo' />
      </Link>
      </div>
      <LoginModal />
      <NavBar/>
    </div>
  )
}

export default Header