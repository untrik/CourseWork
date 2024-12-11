import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const Register = () => {
    const [formData, setFormData] = useState({ login: '', password: '', role: '' }); // Изменено username -> login
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Отправка данных на сервер для регистрации
        fetch('http://localhost:8080/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        })
            .then((response) => {
                if (response.ok) {
                    alert('Регистрация прошла успешно!');
                    navigate('/'); // Перенаправление на страницу входа
                } else {
                    response.json().then((data) => {
                        alert(`Ошибка регистрации: ${data.error}`);
                    });
                }
            })
            .catch((error) => {
                console.error('Ошибка:', error);
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
            <Typography variant="h4">Регистрация</Typography>
            <TextField
                label="Имя пользователя"
                name="login" // Обновлено, чтобы соответствовать ключу "login"
                value={formData.login}
                onChange={handleInputChange}
                fullWidth
                required
            />
            <TextField
                label="Пароль"
                name="password" // Оставлено "password", так как это соответствует JSON
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                fullWidth
                required
            />
            <FormControl fullWidth required>
                <InputLabel id="role-label">Роль</InputLabel>
                <Select
                    labelId="role-label"
                    name="role" // Обновлено, чтобы соответствовать ключу "role"
                    value={formData.role}
                    onChange={handleInputChange}
                >
                    <MenuItem value="Администратор">Администратор</MenuItem>
                    <MenuItem value="Продавец">Продавец</MenuItem>
                    <MenuItem value="Кладовщик">Кладовщик</MenuItem>
                </Select>
            </FormControl>
            <Button variant="contained" color="primary" type="submit">
                Зарегистрироваться
            </Button>
            <Button variant="text" onClick={() => navigate('/')}>
                Вернуться к входу
            </Button>
        </Box>
    );
};

export default Register;
