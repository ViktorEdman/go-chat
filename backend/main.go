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
	router.Any("/404", func(c *gin.Context) {
		c.JSON(404, gin.H{"code": "not found", "message": "404 not found"})
	})

	apiRouter := router.Group("/api")
	apiRouter.GET("/hello", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello World!",
		})
	})
	hub := newHub()
	go hub.run()
	router.GET("/ws", func(c *gin.Context) {
		wsHandler(c, hub)
	})

	router.Run(PORT)
}
