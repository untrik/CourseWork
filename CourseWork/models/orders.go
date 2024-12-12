package models

type Order struct {
	ID          uint    `gorm:"primaryKey"`
	ProductID   uint    `json:"productID"`            // Ссылка на продукт
	Product     Product `gorm:"foreignKey:ProductID"` // Связь с таблицей Product
	Quantity    int     `json:"quantity"`             // Количество заказанного товара
	Status      string  `json:"status"`               // Статус заказа
	Description string  `json:"description"`          // Описание заказа (опционально)
	InvoiceID   uint    `json:"invoiceID"`            // Ссылка на накладную
	Invoice     Invoice `gorm:"foreignKey:InvoiceID"` // Связь с накладной
}
