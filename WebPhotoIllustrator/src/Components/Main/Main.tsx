import React,{useContext} from "react";

import { observer } from "mobx-react-lite";

import { Context } from "../..";
import Auth from "./AuthForm/Auth";
import { Link } from "react-router-dom";
import { Button, Stack } from "@mui/material";

function Main() {
  const { store } = useContext(Context);

  return (
    <div className="main-container">
      <section id="section1" className="section roboto-font">
        {!store.isAuth ? <Auth /> :
        <div>
            <Stack spacing={2} alignItems="center" justifyContent="center" sx={{mt:5, mb:5,backgroundColor:"#00000050", padding:5, borderRadius:2 }}>
              <h2>Привет, {store.user.firstName} {store.user.lastName}!</h2>
              <Link to="/profile"><Button variant="contained">Мой профиль</Button></Link>
              <Link to="/editor"><Button variant="contained">Редактор</Button></Link>
              <Button variant="contained" color="error" onClick={() => store.logout()}>Выйти</Button>
          </Stack>
        </div>}
      </section>
    </div>
  );
}

export default observer(Main);