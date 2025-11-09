import React, {useContext, useState} from "react";

import { Box, TextField, Button, Typography, Stack, Slide } from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import {observer} from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import ConfirmForm from "./ConfirmForm";
import {Context} from "../../../index";

interface RegisterProps {
  onBack: () => void;
  onSuccess: () => void;
  setPendingEmail: React.Dispatch<React.SetStateAction<string>>
}

function Register({ onBack, onSuccess,setPendingEmail  }: RegisterProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<{ email?: string;  password?: string; confirm?: string }>({});
  const { store } = useContext(Context);
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const navigator = useNavigate();

  const validate = () => {
    const newErrors: typeof errors = {};
    if (!email) newErrors.email = "Введите email";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Некорректный email";
    if (!password) newErrors.password = "Введите пароль";
    if (!confirm) newErrors.confirm = "Подтвердите пароль";
    else if (password !== confirm) newErrors.confirm = "Пароли не совпадают";
    if ((password.length && confirm.length) < 6) {
      newErrors.password = "Длина пароля должна быть больше 6"
      newErrors.confirm = "Длина пароля должна быть больше 6"
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleRegister = async (e:React.FormEvent) => {
    e.preventDefault();
    setServerMessage(null); 
    try {
    if (validate()) {
      const success = await store.register(email, password);
      if (success) {
        //navigator("/profile");
        onSuccess();
        setPendingEmail(email);
      }
      else if (store.error) {
        setServerMessage(store.error); 
      }
    }
    }
    catch (error:any) {
      setServerMessage(error.response?.data?.message || "Ошибка сервера");
    }
  }

  return (
    <Slide direction="left" in mountOnEnter unmountOnExit>
      <Box
        component="form"
        onSubmit={handleRegister}
        sx={{
          width: "clamp(280px, 40vw, 400px)",
          p: "clamp(15px, 3vw, 25px)",
          borderRadius: 3,
          boxShadow: 3,
          bgcolor: "white",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Stack spacing={2} sx={{ width: "100%" }}>
          <TextField label="Электронный адрес" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} error={!!errors.email} helperText={errors.email} />
          <TextField label="Пароль" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} error={!!errors.password} helperText={errors.password} />
          <TextField label="Подтверждение пароля" type="password" fullWidth value={confirm} onChange={(e) => setConfirm(e.target.value)} error={!!errors.confirm} helperText={errors.confirm} />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              borderRadius: "25px",
              py: 1.2,
              fontWeight: "bold",
              bgcolor: "green",
              "&:hover": { bgcolor: "darkgreen", transform: "scale(1.02)" },
              transition: "0.3s",
            }}
          >
            Зарегистрироваться
          </Button>

          <Typography
            variant="body2"
            sx={{ textAlign: "center", cursor: "pointer", color: "primary.main" }}
            onClick={onBack}
          >
            Назад к авторизации
          </Typography>
        </Stack>
            {
              <Snackbar
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      open={!!serverMessage} 
                      autoHideDuration={3000} 
                      onClose={() => setServerMessage(null)}
                    >
                      <Alert severity="error">{serverMessage}</Alert>
            </Snackbar>
            }
      </Box>
    </Slide>
  );
}

export default observer(Register);