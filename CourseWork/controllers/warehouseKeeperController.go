// warehouse_methods.go
package controllers

import (
	"awesomeProject3/database"
	"awesomeProject3/models"
	"fmt"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// Получение товаров для приемки
func GetProductsForReceivingKeeper(c *gin.Context) {
	var products []models.Product
	if err := database.DB.Where("storage_location = ?", "Поставщик").Find(&products).Error; err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось получить товары для приемки"})
		return
	}
	c.JSON(http.StatusOK, products)
}
func PickProductFromInvoice(c *gin.Context) {
	invoiceID, err := strconv.Atoi(c.Param("invoiceId"))
	if err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Некорректный ID накладной"})
		return
	}

	var invoice models.Invoice
	if err := database.DB.Preload("Products").First(&invoice, invoiceID).Error; err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Накладная не найдена"})
		return
	}

	var pickedProducts []struct {
		ProductID uint `json:"product_id"`
		Quantity  int  `json:"quantity"`
	}
	if err := c.ShouldBindJSON(&pickedProducts); err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Некорректный формат данных"})
		return
	}

	for _, picked := range pickedProducts {
		var product models.Product
		if err := database.DB.First(&product, picked.ProductID).Error; err != nil {
			fmt.Println("Error binding JSON:", err)
			c.JSON(http.StatusNotFound, gin.H{"error": "Товар с ID не найден", "product_id": picked.ProductID})
			return
		}

		// Проверка доступности
		if product.Quantity < picked.Quantity {
			c.JSON(http.StatusBadRequest, gin.H{
				"error":      "Недостаточно товара на складе",
				"product_id": picked.ProductID,
				"available":  product.Quantity,
			})
			return
		}

		// Обновление количества товара
		product.Quantity -= picked.Quantity
		if product.Quantity == 0 {
			product.StorageLocation = "Поставщик"
		}

		if err := database.DB.Save(&product).Error; err != nil {
			fmt.Println("Error binding JSON:", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка обновления товара", "product_id": picked.ProductID})
			return
		}
	}

	c.JSON(http.StatusOK, gin.H{"message": "Товары успешно подобраны"})
}

// Подтверждение приемки товара
func ConfirmProductReceptionKeeper(c *gin.Context) {
	var reception struct {
		ProductID uint `json:"product_id"`
		Quantity  int  `json:"quantity"`
	}
	if err := c.ShouldBindJSON(&reception); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Некорректный запрос: " + err.Error()})
		return
	}

	log.Printf("Принят товар: ID=%d, Количество=%d\n", reception.ProductID, reception.Quantity)

	var product models.Product
	if err := database.DB.First(&product, reception.ProductID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Товар не найден"})
		return
	}
	product.Quantity = reception.Quantity
	product.StorageLocation = "Кладовщик"
	product.Status = "нормальный"
	product.IsAccepted = "Принят Кладовщиком"

	if err := database.DB.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка обновления товара"})
		return
	}

	log.Printf("Обновленный товар: ID=%d, Новое количество=%d\n", product.ID, product.Quantity)

	c.JSON(http.StatusOK, gin.H{"message": "Товар успешно принят", "product": product})
}

func GetAcceptedProducts(c *gin.Context) {
	// Получаем значение параметра storageLocation
	storageLocation := c.Query("storageLocation")

	var products []models.Product
	query := database.DB.Where("status = ?", "нормальный") // Фильтруем только доступные товары

	// Если передан параметр storageLocation, добавляем его в фильтр
	if storageLocation != "" {
		query = query.Where("storage_location = ?", storageLocation)
	}

	// Выполняем запрос
	if err := query.Find(&products).Error; err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при получении принятых товаров"})
		return
	}

	// Возвращаем результат
	c.JSON(http.StatusOK, products)
}

// Получение товаров по накладной
func GetProductsForInvoice(c *gin.Context) {
	invoiceID, err := strconv.Atoi(c.Param("invoiceId"))
	if err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Некорректный ID накладной"})
		return
	}

	var invoice models.Invoice
	if err := database.DB.Preload("Products").First(&invoice, invoiceID).Error; err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Накладная не найдена"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"invoice": invoice})
}

// Подбор товаров по накладной
func PickProductsForInvoice(c *gin.Context) {
	// Получаем ID накладной и ID товара из параметров запроса
	invoiceID := c.Param("invoice_id")
	productID := c.Param("product_id")

	// Ищем накладную
	var invoice models.Invoice
	if err := database.DB.Preload("Products").First(&invoice, invoiceID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Invoice not found"})
		return
	}

	// Ищем товар
	var product models.Product
	if err := database.DB.First(&product, productID).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"message": "Product not found"})
		return
	}

	// Удаляем связь товара с накладной
	if err := database.DB.Where("invoice_id = ? AND product_id = ?", invoiceID, productID).
		Delete(&models.InvoiceProduct{}).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error deleting product from invoice"})
		return
	}

	// Обновляем поля товара
	product.IsAccepted = "Принят Кладовщиком"
	product.StorageLocation = "Кладовщик"
	if err := database.DB.Save(&product).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"message": "Error updating product"})
		return
	}

	// Ответ
	c.JSON(http.StatusOK, gin.H{"message": "Product removed from invoice and updated"})
}

// Проверка нехватки места на складе
func CheckStorageSpace(c *gin.Context) {
	var products []models.Product
	if err := database.DB.Find(&products).Error; err != nil {
		fmt.Println("Ошибка получения товаров:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка получения товаров"})
		return
	}

	totalProducts := 0
	for _, product := range products {
		totalProducts += product.Quantity
	}

	// Предположим, что это максимальная вместимость склада
	maxStorageCapacity := 1000

	// Если количество товаров больше максимально возможной вместимости склада
	if totalProducts > maxStorageCapacity {
		// Обновление информации о складе, увеличиваем вместимость
		newCapacity := totalProducts + 500 // Пример: добавляем 500 мест
		maxStorageCapacity = newCapacity
		if err := database.DB.Model(&models.Storage{}).Where("id = ?", 1).Update("capacity", newCapacity).Error; err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось обновить вместимость склада"})
			return
		}
		c.JSON(http.StatusOK, gin.H{"message": "Вместимость склада равна: " + fmt.Sprintf("%d", newCapacity)})
	} else {
		c.JSON(http.StatusOK, gin.H{"status": "ok", "message": "Место на складе достаточно"})
	}
}
func GetAllInvoices(c *gin.Context) {
	var invoices []models.Invoice
	// Получаем все накладные с товарами
	if err := database.DB.Preload("Products").Find(&invoices).Error; err != nil {
		fmt.Println("Error fetching invoices:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось получить список накладных"})
		return
	}

	// Отправляем результат в JSON-формате
	c.JSON(http.StatusOK, invoices)
}
func PickProductsFromAllInvoices(c *gin.Context) {
	// Получаем все накладные с их товарами
	var invoices []models.Invoice
	if err := database.DB.Preload("Products").Find(&invoices).Error; err != nil {
		fmt.Println("Error fetching invoices:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Не удалось получить список накладных"})
		return
	}

	// Если нет накладных, возвращаем сообщение
	if len(invoices) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"message": "Нет доступных накладных"})
		return
	}

	// Проходим по всем накладным и их товарам
	for _, invoice := range invoices {
		for _, product := range invoice.Products {
			// Проверяем, доступно ли достаточное количество товара
			if product.Quantity <= 0 {
				continue // Пропускаем товар, если его нет на складе
			}

			// Обновляем количество товара (в примере уменьшаем на 1, можно адаптировать)
			product.Quantity -= 1

			// Логика изменения местоположения
			if product.Quantity == 0 {
				product.StorageLocation = "Поставщик" // Если товар закончился
			} else {
				product.StorageLocation = "Склад" // Если товар еще есть
			}

			// Сохраняем изменения для каждого товара
			if err := database.DB.Save(&product).Error; err != nil {
				fmt.Println("Error updating product:", err)
				c.JSON(http.StatusInternalServerError, gin.H{
					"error":      "Ошибка обновления товара",
					"product_id": product.ID,
				})
				return
			}
		}
	}

	// Успешно завершено
	c.JSON(http.StatusOK, gin.H{"message": "Товары успешно подобраны"})
}
