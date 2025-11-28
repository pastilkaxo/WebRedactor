import React, { useState,useContext,useEffect } from "react";

import { Box, TextField, Button, Typography, Stack, Slide } from "@mui/material";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import {observer}  from "mobx-react-lite";
import { useNavigate } from "react-router-dom";

import ConfirmForm from "./ConfirmForm";
import Register from "./Register";
import ResetPasswordForm from "./RequestResetPasswordForm";
import {Context} from "../../../index";

function Auth(){
  const [showRegister, setShowRegister] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [serverMessage, setServerMessage] = useState<string | null>(null);
  const {store} =  useContext(Context);
  const navigator = useNavigate();

    useEffect(() => {
    return () => {
      store.setError(""); 
    };
  }, []);

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = "Введите email";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Некорректный email";
    if (!password) newErrors.password = "Введите пароль";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerMessage(null); 
    
    if (validate()) {
      try {

        await store.login(email, password);
        if (store.isAuth && store.user.isActivated) {
          navigator("/profile");
        }
        else if (store.isAuth && store.user && !store.user.isActivated) {
          setPendingEmail(email);
          setShowConfirm(true);
        }
        else if (store.error) {
          setServerMessage(store.error); 
        }
      } catch (error: any) {
        setServerMessage(error.response?.data?.message || "Ошибка сервера");
      }
    }
  }

  return (
    <>
      {!showRegister && !showReset && !showConfirm && (
        <Slide direction="right" in={!showRegister} mountOnEnter unmountOnExit>
          <Box
            component="form"
            onSubmit={handleLogin}
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
              <TextField
                label="Электронный адрес"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errors.email}
                helperText={errors.email}
              />
              <TextField
                label="Пароль"
                type="password"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errors.password}
                helperText={errors.password}
              />

              <Typography
                variant="body2"
                color="primary"
                sx={{ textAlign: "right", cursor: "pointer" }}
                onClick={() => setShowReset(true)}
              >
                Забыли пароль?
              </Typography>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  borderRadius: "25px",
                  py: 1.2,
                  fontWeight: "bold",
                  bgcolor: "red",
                  "&:hover": { bgcolor: "darkred", transform: "scale(1.02)" },
                  transition: "0.3s",
                }}
              >
                Войти
              </Button>

              <Typography textAlign="center" sx={{ fontSize: 14 }}>
                ИЛИ
              </Typography>

              <Typography
                variant="body2"
                sx={{ textAlign: "center", cursor: "pointer", color: "primary.main" }}
                onClick={() => setShowRegister(true)}
              >
                Ещё не зарегистрированы?{" "}
                <Box component="span" sx={{ fontWeight: "bold", color: "black" }}>
                  Зарегистрироваться
                </Box>
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
      )}
      {showRegister && <Register setPendingEmail={setPendingEmail} onBack={() => setShowRegister(false)} onSuccess={() => { setShowConfirm(true); setShowRegister(false)}} />}
      {showReset && <ResetPasswordForm onBack={() => setShowReset(false)} />}
      {showConfirm && <ConfirmForm email={pendingEmail} onBack={() => setShowConfirm(false)} />}
    </>
  );
}

export default observer(Auth);