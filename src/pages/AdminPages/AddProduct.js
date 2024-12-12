import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const AddProduct = () => {
    const navigate = useNavigate();  // Хук для навигации
    const [productData, setProductData] = useState({
        name: '',
        quantity: '',
        price: '',
        status: '', // Статус товара
        storage_location: '', // Местоположение товара
        is_accepted: '', // Информация о том, кто принял товар
    });

    // Обработка изменений в полях формы
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProductData((prev) => ({
            ...prev,
            [name]: value,
        }));

        // Если изменилось местоположение, обновляем поле "is_accepted" (прием товара)
        if (name === 'storage_location') {
            let is_accepted = '';
            switch (value) {
                case 'Кладовщик':
                    is_accepted = 'Принят Кладовщиком';
                    break;
                case 'Магазин':
                    is_accepted = 'Принят Продавцом';
                    break;
                default:
                    is_accepted = 'Не принят';
                    break;
            }
            setProductData((prev) => ({
                ...prev,
                is_accepted: is_accepted, // Обновляем поле для отображения приема товара
            }));
        }
    };

    // Обработка отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();

        // Преобразуем цену и количество в нужные типы данных
        const newProductData = {
            ...productData,
            quantity: parseInt(productData.quantity),  // Преобразуем в целое число
            price: parseFloat(productData.price),      // Преобразуем в число с плавающей точкой
        };

        // Отправка данных нового товара на сервер
        fetch('http://localhost:8080/admin/add', {  // Используем POST для добавления товара
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newProductData),  // Отправляем преобразованные данные
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Ошибка при добавлении товара');
                }
                return response.json();
            })
            .then((data) => {
                alert('Товар добавлен!');
                navigate('/admin');  // Перенаправление на страницу администрирования после успешного добавления
            })
            .catch((error) => {
                console.error('Ошибка добавления товара:', error);
                alert('Не удалось добавить товар.');
            });
    };

    return (
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                padding: 3,
                boxShadow: 3,
                maxWidth: 600,
                margin: 'auto',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Добавить товар
            </Typography>

            <TextField
                label="Название товара"
                name="name"
                value={productData.name}
                onChange={handleInputChange}
                fullWidth
                required
            />
            <TextField
                label="Количество"
                name="quantity"
                value={productData.quantity}
                onChange={handleInputChange}
                type="number"
                fullWidth
                required
            />
            <TextField
                label="Цена"
                name="price"
                value={productData.price}
                onChange={handleInputChange}
                type="number"
                fullWidth
                required
            />
            {/* Статус товара */}
            <FormControl fullWidth margin="normal" required>
                <InputLabel>Статус</InputLabel>
                <Select
                    name="status"
                    value={productData.status}
                    onChange={handleInputChange}
                >
                    <MenuItem value="дефектный">Дефектный</MenuItem>
                    <MenuItem value="нормальный">Нормальный</MenuItem>
                </Select>
            </FormControl>
            {/* Местоположение товара */}
            <FormControl fullWidth margin="normal" required>
                <InputLabel>Местоположение</InputLabel>
                <Select
                    name="storage_location"
                    value={productData.storage_location}
                    onChange={handleInputChange}
                >
                    <MenuItem value="Кладовщик">Кладовщик</MenuItem>
                    <MenuItem value="Поставщик">Поставщик</MenuItem>
                    <MenuItem value="Магазин">Магазин</MenuItem>
                </Select>
            </FormControl>
            {/* Прием товара */}
            <TextField
                label="Прием товара"
                value={productData.is_accepted}
                disabled
                fullWidth
            />
            <Button variant="contained" color="primary" type="submit">
                Добавить товар
            </Button>
        </Box>
    );
};

export default AddProduct;
