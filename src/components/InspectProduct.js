import React, { useState } from 'react';
import { inspectProductQuality } from '../services/api';
import {
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

const InspectProduct = () => {
  const [productId, setProductId] = useState('');
  const [status, setStatus] = useState('');

  const handleInspection = async () => {
    try {
      const id = parseInt(productId, 10); // Преобразуем ID в число
      if (isNaN(id) || id <= 0) {
        alert('ID товара должен быть числом больше 0');
        return;
      }
  
      // Создаем объект с ID и статусом для отправки
      const requestBody = { id, status };
  
      // Отправляем запрос с корректным телом
      const response = await inspectProductQuality(requestBody);
  
      if (response.status === 200) {
        alert('Проверка качества завершена!');
        // Перезагружаем страницу
        window.location.reload(); // Перезагружаем страницу
      } else {
        alert('Не удалось завершить проверку качества');
      }
    } catch (error) {
      console.error('Ошибка при проверке качества товара:', error);
      alert('Не удалось завершить проверку качества');
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Проверить качество товара
      </Typography>
      <TextField
        label="ID товара"
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        fullWidth
        margin="normal"
      />
      <FormControl fullWidth margin="normal">
        <InputLabel>Статус</InputLabel>
        <Select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <MenuItem value="дефектный">Дефектный</MenuItem>
          <MenuItem value="нормальный">Нормальный</MenuItem>
        </Select>
      </FormControl>
      <Button variant="contained" color="primary" onClick={handleInspection}>
        Проверить
      </Button>
    </Box>
  );
};

export default InspectProduct;
