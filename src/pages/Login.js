import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Box } from '@mui/material';

const Login = () => {
    const [formData, setFormData] = useState({ login: '', password: '' });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Отправка данных на сервер для авторизации
        fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message === 'Успешный вход') {
                    localStorage.setItem('role', data.role.toLowerCase()); // Сохраняем роль
                    localStorage.setItem('token', data.token); // Сохраняем токен

                    // Проверка роли и перенаправление
                    if (data.role.toLowerCase() === 'администратор') {
                        navigate('/admin'); // Перенаправление для администратора
                    } else if (data.role.toLowerCase() === 'продавец') {
                        navigate('/seller'); // Панель продавца
                    } else {
                        navigate('/keeper'); // Для других пользователей
                    }
                } else {
                    alert('Ошибка входа');
                }
            })
            .catch((error) => {
                console.error('Ошибка входа:', error);
                alert('Не удалось подключиться к серверу.');
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
                justifyContent: 'center',
                height: '100vh',
                gap: 2,
                padding: 3,
                boxShadow: 3,
                maxWidth: 400,
                margin: 'auto',
            }}
        >
            <Typography variant="h4">Вход</Typography>
            <TextField
                label="Имя пользователя"
                name="login"
                value={formData.login}
                onChange={handleInputChange}
                fullWidth
                required
            />
            <TextField
                label="Пароль"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                required
            />
            <Button variant="contained" color="primary" type="submit">
                Войти
            </Button>
            <Button variant="text" onClick={() => navigate('/register')}>
                Зарегистрироваться
            </Button>
        </Box>
    );
};

export default Login;
