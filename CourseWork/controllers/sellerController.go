package controllers

import (
	"awesomeProject3/database"
	"awesomeProject3/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

// Получить список товаров для приемки
func GetProductsForReceiving(c *gin.Context) {
	var products []models.Product
	// Получаем товары, которые ожидают приемки (которые были помечены как "Принят Кладовщиком")
	if err := database.DB.Where("is_accepted = ?", "Принят Кладовщиком").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось получить список товаров для приемки"})
		return
	}

	// Возвращаем список товаров
	c.JSON(http.StatusOK, products)
}

// Подтверждение приемки товаров
func ConfirmProductReception(c *gin.Context) {
	var product models.Product
	// Получаем данные о товаре из тела запроса
	if err := c.ShouldBindJSON(&product); err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Проверяем, что товар в статусе "Принят Кладовщиком", чтобы его можно было принять
	var existingProduct models.Product
	if err := database.DB.Where("id = ? AND is_accepted = ?", product.ID, "Принят Кладовщиком").First(&existingProduct).Error; err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Товар не найден или уже принят продавцом"})
		return
	}

	// Обновляем статус товара на "Принят Продавцом"
	if err := database.DB.Model(&product).Where("id = ?", product.ID).Update("is_accepted", "Принят Продавцом").Update("storage_location", "Магазин").Error; err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось подтвердить приемку товара"})
		return
	}

	// Возвращаем успешный ответ
	c.JSON(http.StatusOK, gin.H{"message": "Товар успешно принят"})
}

// Определение необходимости заказа
func CheckProductStock(c *gin.Context) {
	var products []models.Product
	if err := database.DB.Where("quantity < ?", 10).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось проверить наличие товаров"})
		return
	}

	c.JSON(http.StatusOK, products)
}

// Получить список товаров для продажи
func GetProductsForSale(c *gin.Context) {
	var products []models.Product
	if err := database.DB.Where("quantity > ?", 0).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось получить список товаров для продажи"})
		return
	}
	c.JSON(http.StatusOK, products)
}

// Оформление продажи
func ProcessSale(c *gin.Context) {
	var saleRequest models.Product
	if err := c.ShouldBindJSON(&saleRequest); err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Проверяем наличие товара
	var product models.Product
	if err := database.DB.Where("id = ? AND storage_location = ?", saleRequest.ID, "Магазин").First(&product).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Товар не найден"})
		return
	}

	if product.Quantity < saleRequest.Quantity {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Недостаточно товара на складе"})
		return
	}

	// Оформляем продажу
	product.Quantity -= saleRequest.Quantity
	if err := database.DB.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при оформлении продажи"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Продажа оформлена", "product": product})
}

// Проверка качества товаров
func InspectProductQuality(c *gin.Context) {
	// Структура, в которую мы будем маппировать JSON
	var product models.Product

	// Привязка данных из запроса к структуре Product
	if err := c.ShouldBindJSON(&product); err != nil {
		// Если не удалось привязать данные
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Поиск товара в базе данных по ID
	var existingProduct models.Product
	if err := database.DB.First(&existingProduct, product.ID).Error; err != nil {
		// Если товар не найден, отправляем ошибку
		c.JSON(http.StatusNotFound, gin.H{"error": "Товар не найден"})
		return
	}

	// Логика для отметки дефектных товаров
	if product.Status == "дефектный" {
		existingProduct.IsAccepted = "Не принят"
		existingProduct.StorageLocation = "Поставщик"
	} else {
		existingProduct.IsAccepted = "Принят Продавцом"
		existingProduct.StorageLocation = "Магазин"
	}

	// Обновляем только нужные поля, остальные остаются такими же
	existingProduct.Status = product.Status

	// Сохраняем обновленный товар в базе данных
	if err := database.DB.Save(&existingProduct).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при проверке качества товара"})
		return
	}

	// Возвращаем успешный ответ с обновленным товаром
	c.JSON(http.StatusOK, gin.H{"message": "Проверка качества завершена", "product": existingProduct})
}

// Уведомление о недостатке товаров
func NotifyProductShortage(c *gin.Context) {
	var products []models.Product
	// Находим товары, количество которых меньше 10
	if err := database.DB.Where("quantity < ?", 10).Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при проверке товаров на складе"})
		return
	}

	// Логика для отправки уведомления о заказе
	// Здесь можно реализовать логику формирования и отправки уведомления, например, на склад
	c.JSON(http.StatusOK, gin.H{"message": "Уведомление о недостатке товаров", "products": products})
}

func AddProductToInvoice(c *gin.Context) { // AddProduct создает товар и добавляет его в накладную
	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Создаем товар в базе данных
	if err := database.DB.Create(&product).Error; err != nil {
		fmt.Println("Error creating product:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при добавлении товара"})
		return
	}

	// Получаем ID накладной из запроса
	invoiceID := c.DefaultQuery("invoice_id", "")
	if invoiceID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Не указан ID накладной"})
		return
	}

	// Находим накладную по ID
	var invoice models.Invoice
	// Исправленный запрос для поиска накладной
	if err := database.DB.First(&invoice, "id = ?", invoiceID).Error; err != nil {
		fmt.Println("Error finding invoice:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при поиске накладной"})
		return
	}

	// Добавляем товар в накладную
	if err := database.DB.Model(&invoice).Association("Products").Append(&product); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при добавлении товара в накладную"})
		return
	}

	// Пересчитываем общую сумму накладной
	invoice.Total += product.Price * float64(product.Quantity)

	// Обновляем накладную с новой общей суммой
	if err := database.DB.Save(&invoice).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при обновлении накладной"})
		return
	}

	// Возвращаем успешный ответ с информацией о добавленном товаре и накладной
	c.JSON(http.StatusOK, gin.H{
		"message": "Товар добавлен в накладную",
		"product": product,
		"invoice": invoice,
	})
}

func RemoveProductsFromInvoice(c *gin.Context) {
	var req struct {
		InvoiceID  uint   `json:"invoice_id"`
		ProductIDs []uint `json:"product_ids"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный формат данных"})
		return
	}

	var invoice models.Invoice
	if err := database.DB.Preload("Products").First(&invoice, req.InvoiceID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Накладная не найдена"})
		return
	}

	// Проверяем, если total равен 0
	if invoice.Total == 0 {
		// Удаляем все товары из накладной
		if err := database.DB.Where("invoice_id = ?", req.InvoiceID).Delete(&models.InvoiceProduct{}).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при удалении всех товаров из накладной"})
			return
		}

		// Возвращаем сообщение об успешном удалении
		c.JSON(http.StatusOK, gin.H{
			"message": "Все товары успешно удалены, так как общая стоимость равна 0",
		})
		return
	}

	// Обрабатываем удаление указанных товаров
	for _, productID := range req.ProductIDs {
		var invoiceProduct models.InvoiceProduct

		if err := database.DB.Where("invoice_id = ? AND product_id = ?", req.InvoiceID, productID).First(&invoiceProduct).Error; err == nil {
			// Уменьшаем количество товара или удаляем полностью
			if invoiceProduct.Quantity > 1 {
				invoiceProduct.Quantity--
				if err := database.DB.Save(&invoiceProduct).Error; err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при обновлении количества товара"})
					return
				}
			} else {
				// Удаляем товар, если количество равно 1
				if err := database.DB.Delete(&invoiceProduct).Error; err != nil {
					c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при удалении товара"})
					return
				}
			}
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"error": fmt.Sprintf("Товар с ID %d не найден в накладной", productID)})
			return
		}
	}

	// Обновляем общую стоимость
	updateInvoiceTotal(&invoice)

	c.JSON(http.StatusOK, gin.H{
		"message": "Товары успешно удалены",
		"invoice": invoice,
	})
}

func updateInvoiceTotal(invoice *models.Invoice) {
	var products []models.InvoiceProduct
	database.DB.Where("invoice_id = ?", invoice.ID).Find(&products)

	total := 0.0
	for _, product := range products {
		var p models.Product
		if err := database.DB.First(&p, product.ProductID).Error; err == nil {
			total += float64(product.Quantity) * p.Price
		}
	}

	invoice.Total = total
	database.DB.Save(invoice)
}
func DeleteProductFromInvoice(c *gin.Context) {
	invoiceID := c.Param("invoice_id")
	productID := c.Param("product_id")
	// Ищем накладную
	var invoice models.Invoice
	if err := database.DB.Preload("Products").First(&invoice, invoiceID).Error; err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, gin.H{"message": "Invoice not found"})
		return
	}

	// Ищем товар
	var product models.Product
	if err := database.DB.First(&product, productID).Error; err != nil {
		fmt.Println(err)
		c.JSON(http.StatusNotFound, gin.H{"message": "Product not found"})
		return
	}

	// Удаляем связь товара с накладной
	if err := database.DB.Where("invoice_id = ? AND product_id = ?", invoiceID, productID).
		Delete(&models.InvoiceProduct{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error deleting product from invoice"})
		return
	}
	if err := database.DB.Where("id = ?", productID).
		Delete(&models.Product{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error deleting product from invoice"})
		return
	}
}
