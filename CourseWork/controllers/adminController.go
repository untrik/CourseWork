package controllers

import (
	"awesomeProject3/database"
	"awesomeProject3/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetProductByID(c *gin.Context) {
	// Извлекаем ID из параметров URL
	id := c.Param("id")

	var product models.Product

	// Пытаемся найти продукт по ID в базе данных
	if err := database.DB.First(&product, id).Error; err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Product not found"})
		return
	}

	// Отправляем найденный продукт в ответе
	c.JSON(http.StatusOK, product)
}

// Просмотр всех продуктов
func GetProducts(c *gin.Context) {
	var products []models.Product
	if err := database.DB.Find(&products).Error; err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, products)
}

// Добавление нового продукта
func AddProduct(c *gin.Context) {
	var product models.Product
	if err := c.ShouldBindJSON(&product); err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Create(&product).Error; err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при добавлении товара"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Товар добавлен", "product": product})
}

// Удаление продукта
func DeleteProduct(c *gin.Context) {
	id := c.Param("id")
	if err := database.DB.Delete(&models.Product{}, id).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при удалении товара"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Товар удален"})
}

// Обновление информации о продукте
func UpdateProduct(c *gin.Context) {
	id := c.Param("id")
	var product models.Product
	if err := database.DB.Where("id = ?", id).First(&product).Error; err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Товар не найден"})
		return
	}

	if err := c.ShouldBindJSON(&product); err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if err := database.DB.Save(&product).Error; err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при обновлении товара"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Товар обновлен"})
}

// Поиск товара по имени
func SearchProduct(c *gin.Context) {
	name := c.DefaultQuery("name", "")
	var products []models.Product
	if err := database.DB.Where("name LIKE ?", "%"+name+"%").Find(&products).Error; err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, products)
}
