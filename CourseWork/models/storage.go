package models

type Storage struct {
	ID       uint `json:"StorageId" gorm:"primaryKey"`
	Capacity int  `json:"capacity"` // Емкость склада
}
