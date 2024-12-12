package models

type InvoiceProduct struct {
	InvoiceID uint `gorm:"primaryKey"`
	ProductID uint `gorm:"primaryKey"`
	Quantity  uint
	Invoice   Invoice `gorm:"foreignKey:InvoiceID"`
	Product   Product `gorm:"foreignKey:ProductID"`
}
