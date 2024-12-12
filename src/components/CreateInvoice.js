import React, { useState } from 'react';
import { createInvoice } from '../services/api';
import { Box, Typography, TextField, Button, Card, CardContent } from '@mui/material';

const CreateInvoice = () => {
  const [login, setLogin] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateInvoice = async () => {
    setLoading(true);
    setError('');
  
    try {
      const response = await createInvoice(login);
      console.log(response.data);  
      const invoiceId = response.data.invoice?.InvoiceId;  // Используем InvoiceId
      if (invoiceId) {
        alert(`Накладная создана! ID: ${invoiceId}`);
      } else {
        setError('Накладная не создана, ID не найден');
      }
    } catch (error) {
      setError('Ошибка создания накладной');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box sx={{ padding: 3, display: 'flex', justifyContent: 'flex-start' }}>
      <Card sx={{ width: 400 }}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Создание накладной
          </Typography>

          <TextField
            label="Логин пользователя"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            fullWidth
            margin="normal"
          />
          
          {error && <Typography color="error">{error}</Typography>}

          <Button
            variant="contained"
            color="primary"
            onClick={handleCreateInvoice}
            fullWidth
            disabled={loading}
            sx={{ marginTop: 2 }}
          >
            {loading ? 'Создание...' : 'Создать накладную'}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default CreateInvoice;
