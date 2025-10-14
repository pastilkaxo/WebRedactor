import React from 'react'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

interface AlertSettings { 
  message: string
}

export default function ErrorAlert({ message }: AlertSettings) {
  return (
    <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} autoHideDuration={3000}>
      <Alert variant="filled" severity="error">
        {message}
      </Alert>
    </Snackbar>
  )
}
