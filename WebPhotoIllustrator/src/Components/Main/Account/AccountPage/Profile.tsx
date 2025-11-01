import React, {useContext, useState} from 'react'
import {Context} from "../../../../index";
import {observer} from  "mobx-react-lite";
import UserService from "../../../../Services/UserService";
import {IUser} from "../../../../models/IUser";
import Box from '@mui/joy/Box';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/material/Typography';
import ProfileCard from "./Card";

function Profile() {

    return (
        <Box sx={{flex:1, width:'100%'}}>
            <Stack spacing={4} sx={{
                display: 'flex',
                maxWidth: '800px',
                mx: 'auto',
                mt: '100px',
                px: { xs: 2, md: 6 },
                py: { xs: 2, md: 3 },
            }}>
                <Typography sx={{fontSize:"52px"}} align="center">My Account</Typography>
                <ProfileCard/>
            </Stack>
        </Box>
  )
}

export default observer(Profile);
