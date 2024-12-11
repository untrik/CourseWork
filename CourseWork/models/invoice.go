package models

type Invoice struct {
	ID       uint      `json:"InvoiceId" gorm:"primaryKey"`
	UserID   uint      `json:"user_id"`                                                // ID пользователя, который создает накладную
	Products []Product `gorm:"many2many:invoice_products;constraint:OnDelete:CASCADE"` // Множественная связь с товарами
	Total    float64   `json:"total"`                                                  // Общая сумма накладной
}
