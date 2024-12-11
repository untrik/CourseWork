import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NavigationBar = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1 }}>
                    Склад Магазина
                </Typography>
                <Box>
                    <Button color="inherit" onClick={() => handleNavigation('/')}>
                        Главная
                    </Button>
                    <Button color="inherit" onClick={() => handleNavigation('/login')}>
                        Войти
                    </Button>
                    <Button color="inherit" onClick={() => handleNavigation('/register')}>
                        Регистрация
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default NavigationBar;
