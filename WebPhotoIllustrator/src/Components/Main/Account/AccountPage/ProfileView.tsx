import {useContext, useState,useEffect} from "react";

import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";
import { 
    Box, 
    Button,
    Typography, 
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
} from "@mui/material";
import localforage from "localforage";
import {observer} from  "mobx-react-lite";


import DesktopStack from "./MUI/DesktopStack";
import MobileStack from "./MUI/MobileStack";
import {Context} from "../../../../index";
import {IUser} from "../../../../models/IUser";
import UserService from "../../../../Services/UserService";

function ProfileView() {
      const {store} = useContext(Context);
      const [users, setUsers] = useState<IUser[]>([]);
      const [openEditModal, setOpenEditModal] = useState(false);
      const [editingUser, setEditingUser] = useState<IUser | null>(null);
      const [firstName, setFirstName] = useState("");
      const [lastName, setLastName] = useState("");
      const currentUserId = store.user.id;
  
    
  
  useEffect(() => {
    const loadFullName = async () => {
      const storedFirstName = await localforage.getItem<string>(`firstName_${currentUserId}`);
      const storedLastName = await localforage.getItem<string>(`lastName_${currentUserId}`);
      
      if (storedFirstName) setFirstName(storedFirstName);
      if (storedLastName) setLastName(storedLastName);
    };
    loadFullName();
  }, [currentUserId]);

    const handleSaveUser = async () => {
          if (!store.user) return;
          const currentUserId = store.user.id;
          try {
            const response = await UserService.updateMySelf(currentUserId, { firstName, lastName });
              const updatedUser = {
                  ...response.data,
                  id: response.data.id || response.data._id || currentUserId,
              };
            store.setUser(updatedUser);
            setFirstName(updatedUser.firstName || "");
            setLastName(updatedUser.lastName || "");
            await localforage.setItem(`firstName_${currentUserId}`, updatedUser.firstName || "");
            await localforage.setItem(`lastName_${currentUserId}`, updatedUser.lastName || "");
            handleCloseEdit();
          } catch (err: any) {
              alert(err.response?.data?.message || "Не удалось обновить пользователя");
          }
    };

      const handleOpenEdit = (user: IUser) => {
          setEditingUser(user);
          setFirstName(user.firstName || "");
          setLastName(user.lastName || "");
          setOpenEditModal(true);
      };
  
      const handleCloseEdit = () => {
          setOpenEditModal(false);
          setEditingUser(null);
          setFirstName("");
          setLastName("");
      };
    
  return (
      <>
      <DesktopStack 
          firstName={firstName} 
          lastName={lastName} 
          setFirstName={setFirstName}
          setLastName={setLastName}
      />
        <MobileStack />
      <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
        <CardActions sx={{ alignSelf: "flex-end", pt: 2 }}>
          <Button  onClick={() => handleOpenEdit(store.user)}>
                    Редактировать профиль
          </Button>
          <Button variant="contained" color="error"  onClick={() => store.logout()}>Выйти</Button>
        </CardActions>
      </CardOverflow>
      <Dialog open={openEditModal} onClose={handleCloseEdit} maxWidth="xs" fullWidth>
                      <DialogTitle>Редактирование</DialogTitle>
                      <DialogContent>
                          <Box component="form" sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
                              <TextField
                                  label="Имя (First Name)"
                                  fullWidth
                                  variant="outlined"
                                  size="small"
                                  value={firstName}
                                  onChange={(e) => setFirstName(e.target.value)}
                                  autoFocus
                              />
                               <TextField
                                  label="Фамилия (Last Name)"
                                  fullWidth
                                  variant="outlined"
                                  size="small"
                                  value={lastName}
                                  onChange={(e) => setLastName(e.target.value)}
                              />
                               <Typography variant="caption" color="textSecondary">
                                   ID: {currentUserId}
                               </Typography>
                          </Box>
                      </DialogContent>
                      <DialogActions>
                          <Button onClick={handleCloseEdit} color="inherit">
                              Отмена
                          </Button>
                          <Button onClick={handleSaveUser} variant="contained" color="primary">
                              Сохранить
                          </Button>
                      </DialogActions>
                  </Dialog>
      </>
  )
}

export default observer(ProfileView);