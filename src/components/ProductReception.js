import React, { useState, useEffect } from 'react';
import { getProductsForReceiving, confirmProductReception } from '../services/api';
import { Box, Typography, Button, Select, MenuItem, FormControl, InputLabel, ListItemText } from '@mui/material';

const ProductReception = () => {
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState('');

  // Функция для получения товаров
  const fetchProducts = async () => {
    try {
      const response = await getProductsForReceiving();
      setProducts(response.data);
    } catch (error) {
      console.error("Ошибка при получении списка товаров для приемки:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Подтверждение приемки товара
  const handleReception = async () => {
    try {
      if (!selectedProductId) {
        alert("Пожалуйста, выберите товар для приемки.");
        return;
      }

      // Отправляем только id товара для приемки
      await confirmProductReception(selectedProductId);

      // Показать уведомление об успешном приеме товара
      alert("Товар успешно принят и перемещен в Магазин!");

      // Перезагружаем всю страницу
      window.location.reload(); // Это обновит всю страницу

    } catch (error) {
      console.error("Ошибка при подтверждении приемки товара:", error);
      alert("Не удалось подтвердить приемку товара.");
    }
  };

  const handleProductSelect = (e) => {
    setSelectedProductId(e.target.value);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Подтвердить приемку товара
      </Typography>

      {/* Список товаров для приемки */}
      <FormControl fullWidth margin="normal">
        <InputLabel>Выберите товар</InputLabel>
        <Select
          value={selectedProductId}
          onChange={handleProductSelect}
        >
          {products.map((product) => (
            <MenuItem key={product.id} value={product.id}>
              <ListItemText 
                primary={`ID: ${product.id} - ${product.name}`} 
                secondary={`Количество: ${product.quantity}, Цена: ${product.price} руб, Статус: ${product.status}, Местоположение: ${product.storage_location}`} 
              />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" color="primary" onClick={handleReception}>
        Подтвердить приемку
      </Button>
    </Box>
  );
};

export default ProductReception;
