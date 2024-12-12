package main

import (
	"awesomeProject3/database"
	"awesomeProject3/routes"
	"log"
)

func main() {
	// Инициализация базы данных
	database.InitDB()

	// Настройка маршрутов
	r := routes.SetupRouter()

	// Запуск сервера
	err := r.Run(":8080")
	if err != nil {
		log.Fatalf("Ошибка при запуске сервера: %v", err)
	}
}
