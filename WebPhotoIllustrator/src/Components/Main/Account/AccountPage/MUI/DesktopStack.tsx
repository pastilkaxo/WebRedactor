import React, {useContext, useState} from 'react'
import {Context} from "../../../../../index";
import {observer} from  "mobx-react-lite";
import UserService from "../../../../../Services/UserService";
import {IUser} from "../../../../../models/IUser";
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import IconButton from '@mui/joy/IconButton';
import Stack from '@mui/joy/Stack';


import EmailRoundedIcon from '@mui/icons-material/EmailRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';

function DesktopStack(){
    const {store} = useContext(Context);
    const [users, setUsers] = useState<IUser[]>([]);

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
            sx={{ display: { xs: 'none', md: 'flex' }, my: 1 }}
        >
            <Stack direction="column" spacing={1}>
                <AspectRatio
                    ratio="1"
                    maxHeight={200}
                    sx={{ flex: 1, minWidth: 120, borderRadius: '100%' }}
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
                        bgcolor: 'background.body',
                        position: 'absolute',
                        zIndex: 2,
                        borderRadius: '50%',
                        left: 100,
                        top: 120,
                        boxShadow: 'sm',
                    }}
                >
                    <EditRoundedIcon />
                </IconButton>
            </Stack>
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
                <Stack spacing={1}>
                    <FormLabel>Name</FormLabel>
                    <FormControl
                        sx={{ display: { sm: 'flex-column', md: 'flex-row' }, gap: 2 }}
                    >
                        <Input size="sm" placeholder="First name" />
                        <Input size="sm" placeholder="Last name" sx={{ flexGrow: 1 }} />
                    </FormControl>
                </Stack>
                <Stack direction="row" spacing={2}>
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
                </Stack>
                <Stack direction="row" spacing={1}>
                    <Button onClick={() => store.logout()}>Выйти</Button>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default observer(DesktopStack);