import React, {useContext, useEffect} from 'react'
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
import ResetForm from "./Components/Main/AuthForm/ResetForm";
import CanvasApp from './Components/Main/Fabric/CanvasApp';
import NotFound from './Components/ErrorAlerts/NotFound';

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
        {store.isAuth && <Header/>}
        <div className="flex-grow-1">
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Main  />} />
              <Route path="/storage" element={store.isAuth ?<Storage/> : <Main/>} />
              <Route path="/editor" element={store.isAuth ?<Editor/> : <Main/>} />
              <Route path="/profile" element={store.isAuth ? <Profile /> : <Main />} />
              <Route path="/fabric" element={<CanvasApp/>} />
              <Route path="/password/reset" element={store.wantToResetPassword && !store.isAuth ? <ResetForm /> : <NotFound />} />
              <Route path='*' element={ <NotFound/> } />
            </Routes>
          </main>
        </div>
    </div>
  </Router>
  )
}

export default observer(App);
