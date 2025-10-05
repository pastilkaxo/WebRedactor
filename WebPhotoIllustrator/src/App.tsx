import React from 'react'
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
interface ResponseData {
  message: string;
  status: string;
}

export default function App() {
  const [logged, setLogged] = React.useState(true);
  const [state, setState] = React.useState<ResponseData | null>(null) 
  
  const callbackAPI = async () : Promise< ResponseData| null> => { 
    try {
      const response = await fetch("/api/database/create");
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      else {
        const body = await response.json();
        return body;
      }
    }
    catch (error) {
      console.error("Error fetching data:", error);
      return null;
    }
  }

  React.useEffect(() => {
    callbackAPI().then(data => setState(data));
  }, []);

  return (
    <Router>
    <div className="wrapper d-flex min-vh-100">
        <Header logged={logged} />
        <div className="flex-grow-1" style={{ marginLeft: 0 }}>
        <main className="main-content">
          <Routes>
              <Route path="/" element={<Main logged={ logged } />} />
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
