package controllers

import (
	"awesomeProject3/database"
	"awesomeProject3/models"
	"fmt"
	"log"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

// Регистрация пользователя с ролью в теле запроса
func RegisterUser(c *gin.Context) {
	if database.DB == nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database connection is not initialized"})
		return
	}

	var user models.User
	if err := c.ShouldBindJSON(&user); err != nil {
		log.Printf("Ошибка привязки JSON: %v", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request data"})
		return
	}

	if user.Login == "" || user.Password == "" || user.Role == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Login, password, and role are required"})
		return
	}

	user.Role = strings.ToLower(user.Role)
	validRoles := []string{"администратор", "продавец", "кладовщик"}
	isValidRole := false
	for _, role := range validRoles {
		if user.Role == role {
			isValidRole = true
			break
		}
	}
	if !isValidRole {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid role. Allowed roles: Администратор, Продавец, Кладовщик"})
		return
	}

	var existingUser models.User
	if err := database.DB.Where("login = ?", user.Login).First(&existingUser).Error; err == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "User with this login already exists"})
		return
	}

	if err := database.DB.Create(&user).Error; err != nil {
		log.Printf("Ошибка создания пользователя: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error registering user"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "User registered successfully", "user": user})
}

func LoginUser(c *gin.Context) {
	var user models.User
	// Выполняем привязку и валидацию данных
	if err := c.ShouldBindJSON(&user); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Проверка пользователя по login и паролю
	var storedUser models.User
	if err := database.DB.Where("login = ? AND password = ?", user.Login, user.Password).First(&storedUser).Error; err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Неверный логин или пароль"})
		return
	}

	// Автоматическое определение роли
	role := storedUser.Role
	if role == "" {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Роль не найдена"})
		return
	}

	// Возвращаем успешный ответ с ролью
	c.JSON(http.StatusOK, gin.H{
		"message": "Успешный вход",
		"login":   storedUser.Login,
		"role":    role,
	})
}

// Создание накладной
func CreateInvoice(c *gin.Context) {
	var request struct {
		Login string `json:"login"` // Логин пользователя
	}
	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Неверный формат данных"})
		return
	}

	// Находим пользователя по логину
	var user models.User
	if err := database.DB.Where("login = ?", request.Login).First(&user).Error; err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Пользователь не найден"})
		return
	}

	// Проверка роли пользователя (только продавцы могут создавать накладные)
	if strings.ToLower(user.Role) != "продавец" {
		c.JSON(http.StatusForbidden, gin.H{"error": "Недостаточно прав для создания накладной"})
		return
	}

	// Создаем накладную
	invoice := models.Invoice{
		UserID: user.ID,
	}
	if err := database.DB.Create(&invoice).Error; err != nil {
		fmt.Println("Error binding JSON:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Ошибка при создании накладной"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Накладная создана", "invoice": invoice})
}
