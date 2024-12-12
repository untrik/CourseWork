import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Container, Typography, Box } from '@mui/material';

const ManageInvoicePage = () => {
  // Состояния для добавления товара
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [invoiceID, setInvoiceID] = useState('');

  // Состояния для удаления товара
  const [deleteInvoiceID, setDeleteInvoiceID] = useState('');
  const [deleteProductID, setDeleteProductID] = useState('');

  // Состояния для сообщений об ошибках и успехах
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // Значения по умолчанию для полей
  const isAcceptedDefault = "Поставлен Накладную";
  const storageLocationDefault = "Накладная";
  const statusDefault = "нормальный";

  // Функция для добавления товара
  const handleAddProduct = async (event) => {
    event.preventDefault();

    if (!productName || !quantity || !price || !invoiceID) {
      setError('Все поля для добавления должны быть заполнены');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/invoice/add_product', {
        name: productName,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        status: statusDefault,
        is_accepted: isAcceptedDefault,
        storage_location: storageLocationDefault,
      }, {
        params: { invoice_id: invoiceID },
      });

      const addedProductId = response.data.product.id; // Предполагается, что сервер возвращает ID товара

      setMessage(`Товар добавлен. ID товара: ${addedProductId}`);
      setError('');
      setProductName('');
      setQuantity('');
      setPrice('');
      setInvoiceID('');
    } catch (err) {
      setMessage('');
      setError('Ошибка при добавлении товара');
    }
  };

  // Функция для удаления товара
  const handleDeleteProduct = async (event) => {
    event.preventDefault();

    if (!deleteInvoiceID || !deleteProductID) {
      setError('Все поля для удаления должны быть заполнены');
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:8080/invoices/${deleteInvoiceID}/products/${deleteProductID}`);
      setMessage(response.data.message);
      setError('');
      setDeleteInvoiceID('');
      setDeleteProductID('');
    } catch (err) {
      setMessage('');
      setError('Ошибка при удалении товара');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 4 }}>
        <Typography variant="h4" gutterBottom>
          Управление товарами в накладной
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        {message && <Typography color="success">{message}</Typography>}

        {/* Форма для добавления товара */}
        <Typography variant="h5" gutterBottom>
          Добавить товар
        </Typography>
        <form onSubmit={handleAddProduct}>
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
          <Button variant="contained" color="primary" type="submit" fullWidth sx={{ marginTop: 2 }}>
            Добавить товар
          </Button>
        </form>

        {/* Форма для удаления товара */}
        <Typography variant="h5" gutterBottom sx={{ marginTop: 4 }}>
          Удалить товар
        </Typography>
        <form onSubmit={handleDeleteProduct}>
          <TextField
            label="ID накладной"
            fullWidth
            margin="normal"
            value={deleteInvoiceID}
            onChange={(e) => setDeleteInvoiceID(e.target.value)}
          />
          <TextField
            label="ID товара"
            fullWidth
            margin="normal"
            value={deleteProductID}
            onChange={(e) => setDeleteProductID(e.target.value)}
          />
          <Button variant="contained" color="secondary" type="submit" fullWidth sx={{ marginTop: 2 }}>
            Удалить товар
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default ManageInvoicePage;
