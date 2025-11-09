import React from "react"

import { Typography, Container, Button } from "@mui/material";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="main-container">
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <div style={{backgroundColor:"white", padding:"45px", borderRadius:"25px"}}>
          <Typography variant="h1" component="h1" gutterBottom fontFamily="sans-serif">
        404
          </Typography>
          <Typography variant="h5" component="h2" gutterBottom fontFamily="sans-serif">
        Page Not Found
          </Typography>
          <Typography variant="body1" fontFamily="sans-serif">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </Typography>
          <Button variant="contained" component={Link} to="/" >
        Go to Home
          </Button>
        </div>
      </Container>
    </div>
  )
}
