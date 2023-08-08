package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
)

const PORT = ":3000"
const STATICDIR = "./static"

func main() {
	fmt.Println("Starting server at", "0.0.0.0"+PORT)
	router := gin.Default()
	router.Use(static.Serve("/", static.LocalFile(STATICDIR, true)))
	router.NoRoute(func(c *gin.Context) {
		c.File(STATICDIR + "/index.html")
	})

	apiRouter := router.Group("/api")
	apiRouter.GET("/hello", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello World!",
		})
	})

	router.GET("/ws", wsHandler)

	router.Run(PORT)
}
