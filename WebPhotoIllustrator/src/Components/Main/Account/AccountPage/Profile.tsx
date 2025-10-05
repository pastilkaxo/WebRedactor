import React, {useContext, useState} from 'react'
import {Context} from "../../../../index";
import {observer} from  "mobx-react-lite";
import UserService from "../../../../Services/UserService";
import {IUser} from "../../../../models/IUser";

function Profile() {
  const {store} = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);

    async function getUser(){
        try{
            const response = await UserService.fetchUsers();
            setUsers(response.data);
        }
        catch(err:any){
            console.log(err);
        }
    }


    return (
      <div className='profile-container'>
          <section className='profile-header'>
              <h3>THE ACCOUNT</h3>
              <h2>
                  {store.isLoading
                      ? "Загрузка..."
                      : store.isAuth
                          ? `Пользователь ${store.user.email}`
                          : "Авторизуйтесь"}
              </h2>
              <h2>{store.user.isActivated ? "Аккаунт активирован" : "Активируйте аккаунт!!!"}</h2>
          </section>
          <section className='profile-settings'>
              {store.isAuth? <button onClick={() => store.logout()}>Выйти</button> : null}
              <button onClick={() => getUser()}>Получить пользователей</button>
          </section>
          <section className='profile-info'>
              {users.map(user => <div key={user.id}>
                  {user.email}
              </div>)}
          </section>
    </div>
  )
}

export default observer(Profile);
