import React from "react"

import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

function AccountStats({StatName, StatValue}: any) {
  return (
      <Card sx={{ minWidth: 175, mb: 2 }}>
    <CardContent>
      <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 15 }}>
        {StatName}:
      </Typography>
        <Typography variant="h2" component="div" style={{textAlign:"center",display:"flex",justifyContent:"center",height:"100px",alignItems:"center"}}>
                  {StatValue}
      </Typography>
    </CardContent>
    </Card>
  )
}

export default AccountStats