import React, { useState, useEffect } from "react";
import axios from "axios";

const AllInvoicesPage = () => {
  const baseUrl = "http://localhost:8080"; // Замените на актуальный URL вашего бэкенда
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Загрузка всех накладных
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${baseUrl}/invoices`);

        // Преобразуем данные накладных
        const transformedInvoices = response.data.map((invoice) => ({
          id: invoice.InvoiceId, // Преобразуем ключ InvoiceId -> id
          userId: invoice.user_id,
          products: invoice.Products.map((product) => ({
            id: product.id,
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            status: product.status,
            isAccepted: product.is_accepted,
            storageLocation: product.storage_location,
            description: product.description,
          })),
          total: invoice.total,
        }));

        setInvoices(transformedInvoices);
      } catch (err) {
        setError("Ошибка при загрузке списка накладных");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  // Подбор товаров по всем накладным
  const pickProducts = async () => {
    try {
      const response = await axios.post(`${baseUrl}/invoices/pick`);
      setSuccessMessage(response.data.message);
    } catch (err) {
      setError("Ошибка при подборе товаров");
      // Убираем сообщение об ошибке через 5 секунд
      setTimeout(() => setError(""), 5000);
    }
  };

  // Метод для изменения статуса товара в накладной
  const pickProduct = async (invoiceId, productId) => {
    try {
      const response = await axios.delete(`${baseUrl}/invoice/${invoiceId}/product/${productId}`, {
        product_id: productId,
      });

      setSuccessMessage(response.data.message);

      // Обновляем список накладных после изменения
      const updatedInvoices = invoices.map((invoice) => {
        if (invoice.id === invoiceId) {
          const updatedProducts = invoice.products.map((product) => {
            if (product.id === productId) {
              return { ...product, status: "Подобран" }; // Обновляем статус товара
            }
            return product;
          });
          return { ...invoice, products: updatedProducts };
        }
        return invoice;
      });

      setInvoices(updatedInvoices);
    } catch (err) {
      setError("Ошибка при подборе товара");
      // Убираем сообщение об ошибке через 5 секунд
      setTimeout(() => setError(""), 5000);
    }
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Список накладных</h1>
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {invoices.length === 0 ? (
        <p>Нет доступных накладных</p>
      ) : (
        <table
          border="1"
          style={{
            width: "100%",
            textAlign: "left",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={{ padding: "10px", backgroundColor: "#f2f2f2" }}>
                ID Накладной
              </th>
              <th style={{ padding: "10px", backgroundColor: "#f2f2f2" }}>
                Название товара
              </th>
              <th style={{ padding: "10px", backgroundColor: "#f2f2f2" }}>
                Количество
              </th>
              <th style={{ padding: "10px", backgroundColor: "#f2f2f2" }}>
                Местоположение
              </th>
              <th style={{ padding: "10px", backgroundColor: "#f2f2f2" }}>
                Действия
              </th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <React.Fragment key={invoice.id}>
                {invoice.products && invoice.products.length > 0 ? (
                  invoice.products.map((product) => (
                    <tr key={product.id}>
                      <td style={{ padding: "10px" }}>{invoice.id}</td>
                      <td style={{ padding: "10px" }}>{product.name}</td>
                      <td style={{ padding: "10px" }}>{product.quantity}</td>
                      <td style={{ padding: "10px" }}>{product.storageLocation}</td>
                      <td style={{ padding: "10px" }}>
                        <button
                          onClick={() => pickProduct(invoice.id, product.id)}
                          style={{
                            padding: "5px 10px",
                            backgroundColor: "#007BFF", // Синий цвет кнопки
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                          }}
                        >
                          Подобрать товар
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr key={invoice.id}>
                    <td style={{ padding: "10px" }}>{invoice.id}</td>
                    <td style={{ padding: "10px" }} colSpan="4">
                      Нет доступных товаров
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AllInvoicesPage;
