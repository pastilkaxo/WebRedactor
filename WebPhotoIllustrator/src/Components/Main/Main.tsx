import React,{useContext} from "react";

import { observer } from "mobx-react-lite";

import { Context } from "../..";
import Auth from "./AuthForm/Auth";

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