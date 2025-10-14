import React, {useContext, useState} from 'react';
import { Box, TextField, Button, Typography, Stack, Slide } from '@mui/material';
import {Context} from "../../../index";
import {observer} from "mobx-react-lite";
import { useNavigate } from 'react-router-dom';
import UserService from "../../../Services/UserService";
import ErrorAlert from "../../ErrorAlerts/ErrorAlert";

interface ResetProps {
    onBack: () => void;
}

function ResetForm() {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [errors, setErrors] = useState<{ email?: string;  password?: string; confirm?: string }>({});
    const [serverMessage, setServerMessage] = useState<string | null>(null);
    const [serverSuccessMessage, setServerSuccessMessage] = useState<string | null>(null);
    const navigator = useNavigate();
    const token = new URLSearchParams(window.location.search).get("token")

    const validate = () => {
        const newErrors: typeof errors = {};
        if (!password) newErrors.password = 'Введите пароль';
        if (!confirm) newErrors.confirm = 'Подтвердите пароль';
        else if (password !== confirm) newErrors.confirm = 'Пароли не совпадают';
        if ((password.length && confirm.length) < 6) {
            newErrors.password = "Длина пароля должна быть больше 6"
            newErrors.confirm = "Длина пароля должна быть больше 6"
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmitReset = async () => {
        try{
            if(validate()){
                const response = await UserService.resetPassword(token ?? '', confirm);

            }
        }
        catch(error){
            console.log(error)
        }
    }

    return (
        <Slide direction="left" in mountOnEnter unmountOnExit>
            <Box
                component="form"
                onSubmit={handleSubmitReset}
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
                    <TextField label="Новый пароль" type="password" fullWidth value={password} onChange={(e) => setPassword(e.target.value)} error={!!errors.password} helperText={errors.password} />
                    <TextField label="Подтверждение пароля" type="password" fullWidth value={confirm} onChange={(e) => setConfirm(e.target.value)} error={!!errors.confirm} helperText={errors.confirm} />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{
                            borderRadius: '25px',
                            py: 1.2,
                            fontWeight: 'bold',
                            bgcolor: 'green',
                            '&:hover': { bgcolor: 'darkgreen', transform: 'scale(1.02)' },
                            transition: '0.3s',
                        }}
                    >
                        Подтвердить
                    </Button>

                    <Typography
                        variant="body2"
                        sx={{ textAlign: 'center', cursor: 'pointer', color: 'primary.main' }}
                        onClick={() => navigator("/")}
                    >
                        Назад к авторизации
                    </Typography>
                </Stack>
                <ErrorAlert message={""}/>
            </Box>
        </Slide>
    );
}

export default observer(ResetForm);