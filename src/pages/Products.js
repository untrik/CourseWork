import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Замените URL на ваш бэкенд
        axios.get('http://localhost:8080/products')
            .then((response) => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error.message);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading products...</p>;
    if (error) return <p>Error loading products: {error}</p>;

    return (
        <div>
            <h1>Product List</h1>
            <ul>
                {products.map((product) => (
                    <li key={product.id}>
                        {product.name} - {product.price} - {product.quantity}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Products;
