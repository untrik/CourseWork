import React from 'react';
import ProductsForReceiving from '../components/ProductsForReceiving';
import StorageSpaceCheck from '../components/StorageSpaceCheck';
import AcceptedProducts from '../components/AcceptedProducts';
import AllInvoicesPage from '../components/AllInvoicesPage';

const KeeperPage = () => {
    return (
      <div>
        <h1>Страница Кладовщика</h1>
        < AcceptedProducts/>
        <ProductsForReceiving />
        <StorageSpaceCheck />
        <AllInvoicesPage />
      </div>
    );
  };
  
  export default KeeperPage;

