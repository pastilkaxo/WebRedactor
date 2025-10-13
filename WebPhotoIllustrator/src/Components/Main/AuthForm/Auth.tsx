import React, { useState,useContext } from 'react';
import { Box, TextField, Button, Typography, Stack, Slide } from '@mui/material';
import Register from './Register';
import {Context} from "../../../index";
import {observer}  from "mobx-react-lite";
import { useNavigate } from 'react-router-dom';

function Auth(){
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const {store} =  useContext(Context);
  const navigator = useNavigate();

  const validate = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'Введите email';
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Некорректный email';
    if (!password) newErrors.password = 'Введите пароль';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await store.login(email, password);
      if (store.isAuth) {
        navigator("/profile");
      }
    }
  }

  return (
    <>
      {!showRegister && (
        <Slide direction="right" in={!showRegister} mountOnEnter unmountOnExit>
          <Box
            component="form"
            onSubmit={handleLogin}
            sx={{
              width: 'clamp(280px, 40vw, 400px)',
              p: 'clamp(15px, 3vw, 25px)',
              borderRadius: 3,
              boxShadow: 3,
              bgcolor: 'white',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Stack spacing={2} sx={{ width: '100%' }}>
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
                sx={{ textAlign: 'right', cursor: 'pointer' }}
              >
                Забыли пароль?
              </Typography>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{
                  borderRadius: '25px',
                  py: 1.2,
                  fontWeight: 'bold',
                  bgcolor: 'red',
                  '&:hover': { bgcolor: 'darkred', transform: 'scale(1.02)' },
                  transition: '0.3s',
                }}
              >
                Войти
              </Button>

              <Typography textAlign="center" sx={{ fontSize: 14 }}>
                ИЛИ
              </Typography>

              <Typography
                variant="body2"
                sx={{ textAlign: 'center', cursor: 'pointer', color: 'primary.main' }}
                onClick={() => setShowRegister(true)}
              >
                Ещё не зарегистрированы?{' '}
                <Box component="span" sx={{ fontWeight: 'bold', color: 'black' }}>
                  Зарегистрироваться
                </Box>
              </Typography>
            </Stack>
          </Box>
        </Slide>
      )}
      {showRegister && <Register onBack={() => setShowRegister(false)} />}
    </>
  );
}

export default observer(Auth);