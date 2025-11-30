import {useContext, useState,useEffect} from "react";

import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";
import localforage from "localforage";
import {observer} from  "mobx-react-lite";


import DesktopStack from "./MUI/DesktopStack";
import MobileStack from "./MUI/MobileStack";
import {Context} from "../../../../index";
import {IUser} from "../../../../models/IUser";
import UserService from "../../../../Services/UserService";
import { 
    Box, 
    Typography, 
    Dialog,
    DialogTitle,
    DialogContent,
    TextField,
    DialogActions,
} from "@mui/material";

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
          try {
            const response = await UserService.updateUser(store.user.id, { firstName, lastName });
            store.setUser(response.data);
            setFirstName(response.data.firstName || "");
            setLastName(response.data.lastName || "");
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
          <Button size="sm" variant="solid"  onClick={() => handleOpenEdit(store.user)}>
                    Редактировать профиль
          </Button>
          <Button onClick={() => store.logout()}>Выйти</Button>
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