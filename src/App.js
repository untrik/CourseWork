import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import AdminDashboard from './pages/AdminPages/AdminDashboard'; // Импорт админской панели
import AddProduct from './pages/AdminPages/AddProduct'; // Пример страницы добавления товара
import UpdateProduct from './pages/AdminPages/UpdateProduct'; // Пример страницы обновления товара
import SellerPage from './pages/SellerPage'; // Импорт страницы продавца
import KeeperPage from './pages/KeeperPage'; // Импорт страницы продавца
import PickProductsPage from './components/AllInvoicesPage'; // Импорт страницы продавца

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/products" element={<Products />} />
                <Route path="/admin" element={<AdminDashboard />} /> {/* Страница админки */}
                <Route path="/admin/add" element={<AddProduct />} />
                <Route path="/admin/update/:id" element={<UpdateProduct />} />
                <Route path="/seller" element={<SellerPage />} /> {/* Страница продавца */}
                <Route path="/keeper" element={<KeeperPage />} /> {/* Страница продавца */}
                <Route path="/products/invoice/:invoiceId" element={<PickProductsPage />} />
            </Routes>
        </Router>
    );
};

export default App;
