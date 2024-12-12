package database

import (
	"awesomeProject3/models"
	"log"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

// InitDB инициализирует подключение к базе данных PostgreSQL
func InitDB() *gorm.DB {
	dsn := "host=host.docker.internal port=5432 dbname=warehouse user=postgres password=postgres connect_timeout=10 sslmode=prefer"

	var err error
	// Инициализация базы данных
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Не удалось подключиться к базе данных: %v", err)
	}

	log.Println("Подключение к базе данных установлено.")

	// Автоматическая миграция
	if err := DB.AutoMigrate(&models.User{}, &models.Product{}, &models.Invoice{}, &models.InvoiceProduct{}, &models.Storage{}); err != nil {
		log.Fatalf("Ошибка миграции базы данных: %v", err)
	}

	return DB
}
