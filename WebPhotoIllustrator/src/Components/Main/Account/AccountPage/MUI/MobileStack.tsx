import React, {useContext, useState} from "react"

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import EmailRoundedIcon from "@mui/icons-material/EmailRounded";
import AspectRatio from "@mui/joy/AspectRatio";
import Button from "@mui/joy/Button";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import IconButton from "@mui/joy/IconButton";
import Input from "@mui/joy/Input";
import Stack from "@mui/joy/Stack";
import {observer} from  "mobx-react-lite";

import {Context} from "../../../../../index";
import {IUser} from "../../../../../models/IUser";
import UserService from "../../../../../Services/UserService";

function MobileStack(){
  const {store} = useContext(Context);


  return(
    <Stack
      direction="column"
      spacing={2}
      sx={{ display: { xs: "flex", md: "none" }, my: 1 }}
    >
      <Stack direction="row" spacing={2}>
        <Stack direction="column" spacing={1}>
          <AspectRatio
            ratio="1"
            maxHeight={108}
            sx={{ flex: 1, minWidth: 108, borderRadius: "100%" }}
          >
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
              srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
              loading="lazy"
              alt=""
            />
          </AspectRatio>
          <IconButton
            aria-label="upload new picture"
            size="sm"
            variant="outlined"
            color="neutral"
            sx={{
              bgcolor: "background.body",
              position: "absolute",
              zIndex: 2,
              borderRadius: "50%",
              left: 85,
              top: 120,
              boxShadow: "sm",
            }}
          >
            <EditRoundedIcon />
          </IconButton>
        </Stack>
        <Stack spacing={1} sx={{ flexGrow: 1 }}>
          <FormLabel>Name</FormLabel>
          <FormControl
            sx={{
              display: {
                sm: "flex-column",
                md: "flex-row",
              },
              gap: 2,
            }}
          >
            <Input size="sm" sx={{ width: { xs: "auto", md: "auto" } }} placeholder="First name" />
            <Input size="sm" sx={{ width: { xs: "auto", md: "auto" } }} placeholder="Last name" />
          </FormControl>
        </Stack>
      </Stack>
      <FormControl sx={{ flexGrow: 1 }}>
        <FormLabel>Email</FormLabel>
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
      <Stack direction="row" spacing={1}>
        <Button>Выйти</Button>
      </Stack>
    </Stack>
  )
}

export default observer(MobileStack);