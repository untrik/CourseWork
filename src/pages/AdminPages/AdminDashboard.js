import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Table, TableHead, TableRow, TableCell, TableBody, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/products');
                const data = await response.json();

                // Обновляем товары с количеством 0
                data.forEach((product) => {
                    if (product.quantity === 0) {
                        handleUpdateProductStatus(product.id, {
                            storage_location: 'Поставщик',
                            is_accepted: 'Не принят',
                        });
                    }
                });

                setProducts(data); // Устанавливаем товары
            } catch (error) {
                console.error('Ошибка загрузки товаров:', error);
            }
        };

        fetchProducts();
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAddProduct = () => {
        navigate('/admin/add');
    };

    const handleUpdateProductStatus = async (id, updateData) => {
        try {
            const response = await fetch(`http://localhost:8080/admin/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            if (response.ok) {
                const updatedProduct = await response.json();
                setProducts((prevProducts) =>
                    prevProducts.map((product) =>
                        product.id === id ? { ...product, ...updatedProduct } : product
                    )
                );
            } else {
                console.error('Ошибка обновления товара:', await response.text());
            }
        } catch (error) {
            console.error('Ошибка обновления товара:', error);
        }
    };

    const handleUpdateProduct = (id) => {
        navigate(`/admin/update/${id}`);
    };

    const handleDeleteProduct = (id) => {
        if (window.confirm('Вы уверены, что хотите удалить этот товар?')) {
            fetch(`http://localhost:8080/admin/delete/${id}`, {
                method: 'DELETE',
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.message) {
                        alert('Товар удален!');
                        setProducts(products.filter((product) => product.id !== id));
                    }
                })
                .catch((error) => {
                    console.error('Ошибка удаления товара:', error);
                    alert('Не удалось удалить товар.');
                });
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Панель администратора
            </Typography>

            <Button variant="contained" color="primary" onClick={handleAddProduct}>
                Добавить товар
            </Button>

            {/* Поле для поиска товаров */}
            <TextField
                label="Поиск по названию"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchQuery}
                onChange={handleSearchChange}
            />

            <Table sx={{ marginTop: 3 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Название</TableCell>
                        <TableCell>Количество</TableCell>
                        <TableCell>Цена</TableCell>
                        <TableCell>Статус</TableCell>
                        <TableCell>Местоположение</TableCell>
                        <TableCell>Прием товара</TableCell>
                        <TableCell>Действия</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {filteredProducts.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell>{product.quantity}</TableCell>
                            <TableCell>{product.price}</TableCell>
                            <TableCell>{product.status}</TableCell>
                            <TableCell>{product.storage_location}</TableCell>
                            <TableCell>{product.is_accepted || 'Не принят'}</TableCell>
                            <TableCell>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => handleUpdateProduct(product.id)}
                                    sx={{ marginRight: 1 }}
                                >
                                    Обновить
                                </Button>
                                <Button
                                    variant="outlined"
                                    color="secondary"
                                    onClick={() => handleDeleteProduct(product.id)}
                                >
                                    Удалить
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Box>
    );
};

export default AdminDashboard;
