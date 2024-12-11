import React, { useState } from 'react';
import { processSale } from '../services/api';
import { Box, Typography, TextField, Button } from '@mui/material';

const ProductSale = () => {
  const [productId, setProductId] = useState('');
  const [quantity, setQuantity] = useState('');

  const handleSale = async () => {
    try {
      // Преобразуем данные в числа перед отправкой
      const id = Number(productId);
      const qty = Number(quantity);

      if (isNaN(id) || isNaN(qty) || id <= 0 || qty <= 0) {
        alert("Введите корректные данные для ID товара и количества.");
        return;
      }

      await processSale(id, qty);
      alert("Продажа оформлена!");
    } catch (error) {
      console.error("Ошибка при оформлении продажи:", error);
      alert("Ошибка при оформлении продажи. Попробуйте снова.");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Оформить продажу
      </Typography>
      <TextField
        label="ID товара"
        value={productId}
        onChange={(e) => setProductId(e.target.value)} // Оставляем строку, преобразуем позже
        fullWidth
        margin="normal"
      />
      <TextField
        label="Количество"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)} // Оставляем строку, преобразуем позже
        fullWidth
        margin="normal"
      />
      <Button variant="contained" color="primary" onClick={handleSale}>
        Оформить
      </Button>
    </Box>
  );
};

export default ProductSale;
