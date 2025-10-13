import React,{useContext} from 'react';
import Auth from './AuthForm/Auth';
import { Context } from '../..';
import { observer } from 'mobx-react-lite';

function Main() {
  const { store } = useContext(Context);

  return (
    <div className="main-container">
      <section id="section1" className="section roboto-font">
        {store.isAuth ? <p>Привет, {store.user.email}!</p> : <Auth/>}
      </section>
    </div>
  );
}

export default observer(Main);