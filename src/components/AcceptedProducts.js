import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box } from '@mui/material';

function AcceptedProducts() {
  const baseUrl = 'http://localhost:8080';
  const [acceptedProducts, setAcceptedProducts] = useState([]);

  useEffect(() => {
    // Загрузка принятых товаров с фильтром по storageLocation = "Кладовщик"
    axios
      .get(`${baseUrl}/products/accepted?storageLocation=Кладовщик`)
      .then((response) => {
        setAcceptedProducts(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при загрузке принятых товаров:', error);
      });
  }, []);

  return (
    <Box sx={{ padding: 2 }}>
      {/* Секция: Принятые товары */}
      <Paper elevation={3} sx={{ padding: 2 }}>
        <Typography variant="h5" gutterBottom>
          Принятые товары (Кладовщик)
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Название</TableCell>
                <TableCell>Количество</TableCell>
                <TableCell>Статус</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {acceptedProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.id}</TableCell>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}

export default AcceptedProducts;
