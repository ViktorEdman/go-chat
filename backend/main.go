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
	r := gin.Default()
	r.Use(static.Serve("/", static.LocalFile(STATICDIR, true)))
	r.NoRoute(func(c *gin.Context) {
		c.File(STATICDIR + "/index.html")
	})

	apiRouter := r.Group("/api")
	apiRouter.GET("/hello", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "Hello World!",
		})
	})
	r.Run(PORT)
}
