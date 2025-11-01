import {Context} from "../../../../index";
import {observer} from  "mobx-react-lite";
import UserService from "../../../../Services/UserService";
import {IUser} from "../../../../models/IUser";
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import Card from '@mui/joy/Card';
import CardActions from '@mui/joy/CardActions';
import CardOverflow from '@mui/joy/CardOverflow';

import {useContext, useState} from "react";
import MobileStack from "./MUI/MobileStack";
import DesktopStack from "./MUI/DesktopStack";

function ProfileCard(){
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
        <Card>
        <Divider />
            <DesktopStack/>
            <MobileStack />
            {users.map((user) => <div key={user.id}>
                {user.email}
            </div>)}
        <CardOverflow sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
            <CardActions sx={{ alignSelf: 'flex-end', pt: 2 }}>
                <Button size="sm" variant="outlined" color="neutral">
                    Cancel
                </Button>
                <Button size="sm" variant="solid">
                    Save
                    </Button>
                    <Button size="sm" variant="solid" onClick={getUser}>
                    Fetch Users
                </Button>
            </CardActions>
        </CardOverflow>
    </Card>)
}


export default observer(ProfileCard);