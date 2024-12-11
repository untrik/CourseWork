import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const UpdateProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();  // Хук для навигации
    const [productData, setProductData] = useState({
        name: '',
        quantity: '',
        price: '',
        status: '', // Статус товара
        storage_location: '', // Местоположение товара
        is_accepted: '', // Информация о том, кто принял товар
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        // Получаем данные товара по ID
        fetch(`http://localhost:8080/products/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Ошибка при получении данных товара');
                }
                return response.json();
            })
            .then((data) => {
                setProductData({
                    name: data.name,
                    quantity: data.quantity,
                    price: data.price,
                    status: data.status,
                    storage_location: data.storage_location,
                    is_accepted: data.is_accepted, // Подключаем is_accepted
                });
            })
            .catch((error) => {
                console.error('Ошибка при получении данных товара:', error);
                setError('Не удалось загрузить товар');
            });
    }, [id]);

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
        const updatedProductData = {
            ...productData,
            quantity: parseInt(productData.quantity),  // Преобразуем в целое число
            price: parseFloat(productData.price),      // Преобразуем в число с плавающей точкой
        };

        // Отправка обновленных данных на сервер
        fetch(`http://localhost:8080/admin/update/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedProductData),  // Отправляем преобразованные данные
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Ошибка при обновлении товара');
                }
                return response.json();
            })
            .then((data) => {
                alert('Товар обновлен!');
                navigate('/admin');  // Перенаправление на страницу администрирования
            })
            .catch((error) => {
                console.error('Ошибка обновления товара:', error);
                alert('Не удалось обновить товар.');
            });
    };

    if (error) {
        return (
            <Box sx={{ padding: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

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
                Обновить товар
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
                    disabled // Статус не редактируем, он определяется автоматически
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
                Обновить товар
            </Button>
        </Box>
    );
};

export default UpdateProduct;
