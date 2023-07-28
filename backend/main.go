package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

const PORT = ":3000"
const HOST = "0.0.0.0"
const ADDRESS = HOST + ":" + PORT

func main() {
	fmt.Println("Starting server at", HOST+":"+PORT)
	r := gin.Default()
	r.Use(static.Serve("/", static.LocalFile("./static", true)))
	r.GET("/hello", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello World!",
		})
	})
	r.Run(PORT)
}
