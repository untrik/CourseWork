import React, { useState, useEffect } from 'react';
import { getProductsForSale, processSale } from '../services/api';
import { 
  Box, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  TextField 
} from '@mui/material';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [saleProductId, setSaleProductId] = useState('');
  const [saleQuantity, setSaleQuantity] = useState('');

  const fetchProducts = async () => {
    try {
      const response = await getProductsForSale();
      // Фильтруем товары, принимая только те, которые находятся в магазине и приняты продавцом
      const filteredProducts = response.data.filter(
        (product) => product.is_accepted === 'Принят Продавцом' && product.storage_location === 'Магазин'
      );
      setProducts(filteredProducts);
    } catch (error) {
      console.error("Ошибка при получении списка товаров:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSale = async () => {
    try {
      const id = Number(saleProductId);
      const qty = Number(saleQuantity);

      if (isNaN(id) || isNaN(qty) || id <= 0 || qty <= 0) {
        alert("Введите корректные данные для ID товара и количества.");
        return;
      }

      // Находим товар по ID в отфильтрованном списке
      const product = products.find((product) => product.id === id);

      // Если товар не найден или он дефектный
      if (!product) {
        alert("Товар не найден.");
        return;
      }

      if (product.status === "дефектный") {
        alert("Невозможно продать дефектный товар.");
        return;
      }

      // Проверка на доступность необходимого количества товара
      if (product.quantity < qty) {
        alert("Недостаточно товара на складе.");
        return;
      }

      // Процесс продажи товара
      await processSale(id, qty); // Выполнить продажу
      alert("Продажа оформлена!");
      fetchProducts(); // Обновить список товаров

      setSaleProductId(''); // Очистить поля ввода
      setSaleQuantity('');
    } catch (error) {
      console.error("Ошибка при оформлении продажи:", error);
      alert("Ошибка при оформлении продажи. Попробуйте снова.");
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Товары для продажи
      </Typography>
      <TableContainer component={Paper} sx={{ marginBottom: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Количество</TableCell>
              <TableCell>Цена</TableCell>
              <TableCell>Статус</TableCell>
              <TableCell>Местоположение</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.status}</TableCell>
                <TableCell>{product.storage_location}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="h5" gutterBottom>
        Оформить продажу
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 2 }}>
        <TextField
          label="ID товара"
          value={saleProductId}
          onChange={(e) => setSaleProductId(e.target.value)}
        />
        <TextField
          label="Количество"
          type="number"
          value={saleQuantity}
          onChange={(e) => setSaleQuantity(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSale}>
          Оформить продажу
        </Button>
      </Box>
    </Box>
  );
};

export default ProductList;
