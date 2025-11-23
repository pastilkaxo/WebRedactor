import {useContext, useState,useEffect} from "react";

import localforage from "localforage";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";
import {observer} from  "mobx-react-lite";


import DesktopStack from "./MUI/DesktopStack";
import MobileStack from "./MUI/MobileStack";
import {Context} from "../../../../index";
import {IUser} from "../../../../models/IUser";
import UserService from "../../../../Services/UserService";


function ProfileView() {
      const {store} = useContext(Context);
      const [users, setUsers] = useState<IUser[]>([]);
      const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  
  const currentUserId = store.user.id;
  
  const handleSave = async () => {
    try {
      await Promise.all([
        localforage.setItem(`lastName_${currentUserId}`, lastName),
        localforage.setItem(`firstName_${currentUserId}`, firstName)
      ]);
      console.log("Данные сохранены!");
    } catch (e) {
      console.error("Ошибка сохранения", e);
    }
  };
    
      async function getUser(){
        try{
          const response = await UserService.fetchUsers();
          setUsers(response.data);
        }
        catch(err:any){
          console.log(err);
        }
  }
  
  useEffect(() => {
    const loadFullName = async () => {
      const storedFirstName = await localforage.getItem<string>(`firstName_${currentUserId}`);
      const storedLastName = await localforage.getItem<string>(`lastName_${currentUserId}`);
      
      if (storedFirstName) setFirstName(storedFirstName);
      if (storedLastName) setLastName(storedLastName);
    };
    loadFullName();
  }, [currentUserId]);
    
  return (
      <>
      <DesktopStack 
          firstName={firstName} 
          lastName={lastName} 
          setFirstName={setFirstName}
          setLastName={setLastName}
      />
        <MobileStack />
      {users.map((user) => <div key={user.id}>
        {user.email}
      </div>)}
      <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
        <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
          <Button size="sm" variant="outlined" color="neutral">
                    Cancel
          </Button>
          <Button size="sm" variant="solid" onClick={handleSave}>
                    Save
          </Button>
          <Button size="sm" variant="solid" onClick={getUser}>
                    Fetch Users
          </Button>
        </CardActions>
      </CardOverflow>
      </>
  )
}

export default observer(ProfileView);