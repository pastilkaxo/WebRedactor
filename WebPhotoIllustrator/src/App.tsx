import React, {useContext, useEffect,useState} from 'react'
import "./Styles/App.css"
import {
  BrowserRouter as Router,
  Routes,
  Route,
}
  from 'react-router-dom';
import Main from './Components/Main/Main';
import Header from './Components/Header/Header';
import Editor from './Components/Main/Editor/Editor';
import Storage from './Components/Main/Storage/Storage';
import Profile from './Components/Main/Account/AccountPage/Profile';
import {Context} from "./index"
import {observer} from "mobx-react-lite"
// import '@fontsource/inter';


function App() {
    const {store} = useContext(Context);
    useEffect(() => {
        if(localStorage.getItem("token")){
            store.checkAuth();
        }
    }, []);

  return (
    <Router>
    <div className="wrapper d-flex min-vh-100">
        <Header  />
        <div className="flex-grow-1">
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Main  />} />
              <Route path="/storage" element={<Storage />} />
              <Route path="/editor" element={<Editor />} />
              <Route path="/profile" element={<Profile/>} />
            </Routes>
          </main>
        </div>
    </div>
  </Router>
  )
}

export default observer(App);
