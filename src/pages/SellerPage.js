import React from 'react';
import ProductList from '../components/ProductList';
import ProductReception from '../components/ProductReception';
import InspectProduct from '../components/InspectProduct';
import CreateInvoice from '../components/CreateInvoice';
import InvoiceManager from "../components/InvoiceManager"; // Проверьте правильность пути


const SellerPage = () => {
  return (
    <div>
      <h1>Страница Продавца</h1>
      <ProductList />
      <ProductReception />
      <InspectProduct />
      <CreateInvoice />
      <InvoiceManager />
    </div>
  );
};

export default SellerPage;
