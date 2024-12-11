import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const AddProductPage = () => {
  // Состояния для данных формы
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [invoiceID, setInvoiceID] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Значения по умолчанию для полей
  const isAcceptedDefault = "Поставлен Накладную";
  const storageLocationDefault = "Накладная";
  const statusDefault = "Нормальный"; // Добавлено значение по умолчанию для статуса

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Проверка на пустые поля
    if (!productName || !quantity || !price || !invoiceID) {
      setError('Все поля должны быть заполнены');
      return;
    }

    try {
      // Отправка POST-запроса на сервер
      const response = await axios.post('http://localhost:8080/invoice/add_product', {
        name: productName,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        status: statusDefault, // Используем значение по умолчанию для статуса
        is_accepted: isAcceptedDefault, // Используем значение по умолчанию для прием товара
        storage_location: storageLocationDefault, // Используем значение по умолчанию для местоположения
      }, {
        params: { invoice_id: invoiceID } // ID накладной
      });

      setMessage(response.data.message);
      setError('');
      // Очистка формы после успешного добавления товара
      setProductName('');
      setQuantity('');
      setPrice('');
      setInvoiceID('');
    } catch (err) {
      setMessage('');
      setError('Ошибка при добавлении товара');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Добавить товар в накладную
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {message && <Typography color="success">{message}</Typography>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="ID накладной"
            fullWidth
            margin="normal"
            value={invoiceID}
            onChange={(e) => setInvoiceID(e.target.value)}
          />
          <TextField
            label="Название товара"
            fullWidth
            margin="normal"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
          <TextField
            label="Количество"
            fullWidth
            margin="normal"
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <TextField
            label="Цена"
            fullWidth
            margin="normal"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          {/* Поле "Статус" можно не показывать пользователю, так как оно имеет значение по умолчанию */}
          <TextField
            label="Статус"
            fullWidth
            margin="normal"
            value={statusDefault} // Значение по умолчанию
            disabled
          />

          <Button variant="contained" color="primary" type="submit" fullWidth sx={{ marginTop: 2 }}>
            Добавить товар
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AddProductPage;
