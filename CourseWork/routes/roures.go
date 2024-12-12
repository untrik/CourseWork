package routes

import (
	"awesomeProject3/controllers"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func SetupRouter() *gin.Engine {
	r := gin.Default()
	r.Use(cors.Default())
	// Регистрация пользователей через одну ссылку
	r.POST("/register", controllers.RegisterUser) // Регистрация с указанием роли в теле запроса

	// Вход для пользователей
	r.POST("/login", controllers.LoginUser)

	// --------------------------------
	// Продавец
	// --------------------------------
	r.GET("/products/receive", controllers.GetProductsForReceiving)       // Получить список товаров для приемки
	r.POST("/products/receive", controllers.ConfirmProductReception)      // Подтвердить приемку товаров
	r.GET("/products/check_stock", controllers.CheckProductStock)         // Проверка уровня запасов
	r.GET("/products/sale", controllers.GetProductsForSale)               // Получить товары для продажи
	r.POST("/products/sale", controllers.ProcessSale)                     // Оформление продажи
	r.PUT("/products/inspect_quality", controllers.InspectProductQuality) // Проверка качества товаров
	r.GET("/products/shortage", controllers.NotifyProductShortage)        // Уведомление о недостатке товаров

	// --------------------------------
	// Администратор
	// --------------------------------
	r.GET("/products/:id", controllers.GetProductByID)
	r.GET("/products/accepted", controllers.GetAcceptedProducts)
	r.GET("/products", controllers.GetProducts)              // Получить список товаров
	r.POST("/admin/add", controllers.AddProduct)             // Добавить новый товар
	r.PUT("/admin/update/:id", controllers.UpdateProduct)    // Обновить товар
	r.DELETE("/admin/delete/:id", controllers.DeleteProduct) // Удалить товар
	r.GET("/products/search", controllers.SearchProduct)     // Поиск товара

	// --------------------------------
	// Накладные
	// --------------------------------
	r.POST("/invoices", controllers.CreateInvoice)                           // Создание накладной
	r.POST("/invoice/add_product", controllers.AddProductToInvoice)          // Добавить товар в накладную
	r.POST("/invoice/remove_product", controllers.RemoveProductsFromInvoice) // Удалить товар из накладной

	// --------------------------------
	// Кладовщик
	r.GET("/products/storage_space", controllers.CheckStorageSpace)
	// --------------------------------
	// Получение товаров для приемки
	r.GET("/products/receive/kladovshik", controllers.GetProductsForReceivingKeeper)  // Получить товары для приемки
	r.POST("/products/receive/kladovshik", controllers.ConfirmProductReceptionKeeper) // Подтвердить приемку товаров
	r.POST("/invoices/pick_product", controllers.PickProductsForInvoice)
	// Отправка товаров в магазин
	r.GET("/products/dispatch", controllers.GetProductsForReceiving) // Получить товары для отправки

	// Подбор товаров по накладной
	r.GET("/products/invoice/:invoiceId", controllers.GetProductsForInvoice)                 // Получить товары по накладной
	r.DELETE("/invoice/:invoice_id/product/:product_id", controllers.PickProductsForInvoice) // Подобрать товар по накладной
	r.GET("/invoices", controllers.GetAllInvoices)
	r.DELETE("/invoices/:invoice_id/products/:product_id", controllers.DeleteProductFromInvoice)
	return r
}
