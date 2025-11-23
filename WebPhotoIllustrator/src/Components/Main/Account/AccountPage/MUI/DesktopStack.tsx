import React, {useContext, useEffect, useState} from "react"

import localforage from "localforage";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AspectRatio from "@mui/joy/AspectRatio";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import { Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import Avatar from '@mui/material/Avatar';
import ButtonBase from '@mui/material/ButtonBase';

import {Context} from "../../../../../index";
import {IUser} from "../../../../../models/IUser";
import UserService from "../../../../../Services/UserService";

function DesktopStack({ firstName, lastName, setFirstName, setLastName }: any) {
  const [avatar, setAvatar] = useState<string | undefined>(undefined);
  const {store} = useContext(Context);
  const [users, setUsers] = useState<IUser[]>([]);
  const currentUserId = store.user.id;

  const handleChangeAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        const result = reader.result as string;
        setAvatar(result);
        await localforage.setItem(`avatar_${currentUserId}`, result);
      }
      reader.readAsDataURL(file);
    }
  };


  useEffect(() => {
    const loadAvatar = async () => {
          const stored = await localforage.getItem<string>(`avatar_${currentUserId}`);
          if(stored) setAvatar(stored);
    }
  loadAvatar();
  }, [currentUserId]);



  async function getUser(){
    try{
      const response = await UserService.fetchUsers();
      setUsers(response.data);
    }
    catch(err:any){
      console.log(err);
    }
  }
  return(
    <Stack
      direction="row"
      spacing={3}
      sx={{ display: { xs: "none", md: "flex" }, my: 1 }}
    >
      <Stack direction="column" spacing={1}>
          <ButtonBase
            component="label"
            role={undefined}
            tabIndex={-1} 
            aria-label="Avatar image"
            sx={{
              borderRadius: '40px',
              '&:has(:focus-visible)': {
                outline: '2px solid',
                outlineOffset: '2px',
              },
      }}
    >
          <Avatar alt="Upload new avatar" src={avatar} style={{
            width: 200,
            height:200
      }}/>
      <input
        type="file"
        accept="image/*"
        style={{
          border: 0,
          clip: 'rect(0 0 0 0)',
          height: '1px',
          margin: '-1px',
          overflow: 'hidden',
          padding: 0,
          position: 'absolute',
          whiteSpace: 'nowrap',
          width: '1px',
        }}
        onChange={handleChangeAvatar}
      />
    </ButtonBase>
      </Stack>
      <Stack spacing={2} sx={{ flexGrow: 1 }}>
        <Stack spacing={1}>
          <FormLabel>Name</FormLabel>
          <FormControl
            sx={{ display: { sm: "flex-column", md: "flex-row" }, gap: 2 }}
          >
            <Input 
                size="sm" 
                placeholder="First name" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)}
            />
            <Input 
                size="sm" 
                placeholder="Last name" 
                sx={{ flexGrow: 1 }} 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
          </FormControl>
        </Stack>
        <Stack direction="row" spacing={2}>
          <FormControl sx={{ flexGrow: 1 }}>
            <FormLabel>Email: {store.isActivated ? "Почта активирована" : "Почта не активирована!"}</FormLabel>
            <Input
              size="sm"
              type="email"
              startDecorator={<EmailRoundedIcon />}
              placeholder="email"
              defaultValue={store.user.email}
              value={store.user.email}
              sx={{ flexGrow: 1 }}
            />
          </FormControl>

        </Stack>
        <Stack direction="row" spacing={1}>
           <Button onClick={() => store.logout()}>Сменить пароль</Button>
          <Button onClick={() => store.logout()}>Выйти</Button>
        </Stack>
      </Stack>
    </Stack>
  )
}

export default observer(DesktopStack);