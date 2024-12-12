import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Замените на ваш URL бэкенда

// Получить товары для продажи
export const getProductsForSale = () => axios.get(`${API_URL}/products/sale`);

// Подтвердить приемку товара
export const confirmProductReception = (productId) => 
  axios.post(`${API_URL}/products/receive`, { id: productId });

// Оформить продажу
export const processSale = async (productId, quantity) => {
    const payload = {
      id: productId, // Уже преобразован в число
      quantity: quantity, // Уже преобразован в число
    };
  
    return fetch('http://localhost:8080/products/sale', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }).then((response) => {
      if (!response.ok) {
        throw new Error("Ошибка при оформлении продажи");
      }
      return response.json();
    });
  };
  

// Создать заказ на товар
export const createProductOrder = (productId, quantity) => {
    return axios.post(`${API_URL}/products/order`, { productID: productId, quantity: quantity });
  };
  
// Проверить качество товара
export const inspectProductQuality = (requestBody) => {
    return axios.put(`${API_URL}/products/inspect_quality`, requestBody);  // Используем PUT вместо POST, если это обновление
  };
  export const getProductsForReceiving = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/receive`);
      return response;
    } catch (error) {
      throw new Error('Ошибка при получении списка товаров для приемки: ' + error.message);
    }
  };

  // Создание накладной
  export const createInvoice = (login) => {
    return axios.post(`${API_URL}/invoices`, { login });
  };
  
export const addProductToInvoice = async (invoiceId, productId, quantity) => {
  try {
    const response = await axios.post(`${API_URL}/invoices/${invoiceId}/products`, {
      productId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Ошибка при добавлении товара в накладную:", error);
    throw error;  // Повторно выбрасываем ошибку, чтобы она обрабатывалась в компоненте
  }
};

// Функция для удаления товара из накладной
export const removeProductFromInvoice = async (invoiceId, productId) => {
  try {
    const response = await axios.delete(`${API_URL}/invoices/${invoiceId}/products/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Ошибка при удалении товара из накладной:", error);
    throw error;  // Повторно выбрасываем ошибку, чтобы она обрабатывалась в компоненте
  }
};
export const getProductPrice = async (productId) => {
    try {
      // Запрос для получения данных о товаре по его ID
      const response = await axios.get(`${API_URL}/products/${productId}`);
      return response.data;  // Предполагаем, что сервер возвращает объект с данными товара, включая цену
    } catch (error) {
      console.error('Ошибка при получении цены товара:', error);
      throw error;  // Пробрасываем ошибку, чтобы компонент мог ее обработать
    }
  };
  

