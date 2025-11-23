import React, {useContext, useState} from "react"

import Box from "@mui/joy/Box";
import Stack from "@mui/joy/Stack";
import Typography from "@mui/material/Typography";
import {observer} from  "mobx-react-lite";

import ProfileCard from "./Card";
import {Context} from "../../../../index";
import {IUser} from "../../../../models/IUser";
import UserService from "../../../../Services/UserService";

function Profile() {

  return (
    <Box sx={{flex:1, width:"100%"}}>
      <Stack spacing={4} sx={{
        display: "flex",
        mx: "auto",
        px: { xs: 2, md: 6 },
        py: { xs: 2, md: 3 },
      }}>
        <ProfileCard/>
      </Stack>
    </Box>
  )
}

export default observer(Profile);
