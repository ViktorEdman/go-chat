package main

import (
	"fmt"
	"github.com/gin-gonic/gin"
)

const PORT = ":3000"
const HOST = "0.0.0.0"
const ADDRESS = HOST + ":" + PORT

func main() {
	fmt.Println("Starting server at", HOST+":"+PORT)
	r := gin.Default()
	//	r.GET("/", func(c *gin.Context) {
	//		c.File("./dist/index.html")
	//	})
	r.Static("/", "./dist")
	r.Run(PORT)
}
