package models

type Product struct {
	ID              uint    `json:"id" gorm:"primaryKey"`
	Name            string  `json:"name"`
	Quantity        int     `json:"quantity"`
	Price           float64 `json:"price"`
	Status          string  `json:"status"`
	IsAccepted      string  `json:"is_accepted"` // Утверждение о приеме товара
	StorageLocation string  `json:"storage_location"`
}
