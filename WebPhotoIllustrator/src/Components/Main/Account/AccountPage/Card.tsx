import {useContext, useState} from "react";

import Box from "@mui/joy/Box";
import Button from "@mui/joy/Button";
import Card from "@mui/joy/Card";
import CardActions from "@mui/joy/CardActions";
import CardOverflow from "@mui/joy/CardOverflow";
import Divider from "@mui/joy/Divider";
import AppBar from "@mui/material/AppBar";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import {observer} from  "mobx-react-lite";

import AdminView from "./AdminView";
import DesktopStack from "./MUI/DesktopStack";
import MobileStack from "./MUI/MobileStack";
import ProfileView from "./ProfileView";
import ProjectsView from "./ProjectsView";
import SettingsView from "./SettingsView";
import {Context} from "../../../../index";
import {IUser} from "../../../../models/IUser";
import UserService from "../../../../Services/UserService";
import FavView from "./FavView";

interface TabPanelProps {
  children?: React.ReactNode;
  dir?: string;
  index: number;
  value: number;
}


function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
            {children}
        </Box>
      )}
    </div>
  );
}



function a11yProps(index: number) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}



function ProfileCard(){
  const {store} = useContext(Context);
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };



  return(
    <Card>
      <AppBar position="static">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Профиль" {...a11yProps(0)} />
          <Tab label="Проекты" {...a11yProps(1)} />
          <Tab label="Избранное" {...a11yProps(2)} />
          <Tab label="Настройки" {...a11yProps(3)} />
          {store.user.roles.includes("ADMIN") && <Tab label="Админ панель" {...a11yProps(4)} />}
        </Tabs>
      </AppBar>
      <Divider />
      <TabPanel value={value} index={0}>
        <ProfileView/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ProjectsView/>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <FavView/>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <SettingsView/>
      </TabPanel>
      <TabPanel value={value} index={4}>
        {store.user.roles.includes("ADMIN") && <AdminView />}
      </TabPanel>
    </Card>
  )
}


export default observer(ProfileCard);