package models

type User struct {
	ID       uint   `gorm:"primaryKey"`
	Login    string `json:"login" binding:"required"  gorm:"unique"`
	Password string `json:"password" binding:"required"`
	Role     string `json:"role"`
}
