import React from 'react'
import Alert from '@mui/material/Alert'

interface AlertSettings { 
  message: string
}

export default function ErrorAlert({ message }: AlertSettings) {
  return (
    <Alert variant="filled" severity="error">
      {message}
    </Alert>
  )
}
