package main

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/contrib/static"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

const PORT = ":3000"
const STATICDIR = "./static"

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

var clients []websocket.Conn

func wsHandler(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		return
	}
	clients = append(clients, *conn)
	for {
		messageType, message, err := conn.ReadMessage()
		if err != nil {
			return
		}
		for _, client := range clients {
			err := client.WriteMessage(messageType, message)
			if err != nil {
				return
			}
		}
	}

}

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
