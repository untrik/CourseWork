import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button } from '@mui/material';

function ProductsForReceiving() {
  const baseUrl = 'http://localhost:8080';
  const [products, setProducts] = useState([]);

  // Функция для загрузки списка товаров
  const fetchProducts = () => {
    axios
      .get(`${baseUrl}/products/receive/kladovshik`)
      .then((response) => {
        // Фильтруем товары, чтобы исключить те, у которых количество = 0
        const filteredProducts = response.data.filter(product => product.quantity > 0);
        setProducts(filteredProducts);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке товаров:', error);
      });
  };

  // Функция для подтверждения приемки товара
  const confirmReception = (productId, quantity) => {
    axios
      .post(`${baseUrl}/products/receive/kladovshik`, {
        product_id: productId, // Отправляем как число
        quantity: quantity,   // Количество тоже как число
      })
      .then((response) => {
        alert(`Товар ${productId} успешно принят!`);
        // Перезагружаем список товаров
        fetchProducts(); // Вместо перезагрузки всей страницы
      })
      .catch((error) => {
        console.error('Ошибка при подтверждении приемки товара:', error);
      });
  };

  // Загружаем список товаров при монтировании компонента
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <Paper elevation={3} sx={{ padding: 2, margin: 2 }}>
      <Typography variant="h5" gutterBottom>
        Товары для приемки
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Название</TableCell>
              <TableCell>Количество</TableCell>
              <TableCell>Действие</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => confirmReception(product.id, product.quantity)}
                  >
                    Принять
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}

export default ProductsForReceiving;
