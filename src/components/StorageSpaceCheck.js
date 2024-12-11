import React, { useState } from 'react';
import axios from 'axios';
import { Button, Typography, Paper } from '@mui/material';

function StorageSpaceCheck() {
  const baseUrl = 'http://localhost:8080';
  const [status, setStatus] = useState('');

  const checkStorage = () => {
    axios
      .get(`${baseUrl}/products/storage_space`)
      .then((response) => {
        setStatus(response.data.message);
      })
      .catch((error) => {
        console.error('Ошибка при проверке места на складе:', error);
      });
  };

  return (
    <Paper elevation={3} sx={{ padding: 2, margin: 2 }}>
      <Typography variant="h5" gutterBottom>
        Проверка места на складе
      </Typography>
      <Button variant="contained" color="primary" onClick={checkStorage}>
        Проверить
      </Button>
      {status && (
        <Typography variant="body1" sx={{ marginTop: 2 }}>
          {status}
        </Typography>
      )}
    </Paper>
  );
}

export default StorageSpaceCheck;
