package main

import (
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

type Client struct {
	hub  *Hub
	conn *websocket.Conn
	send chan []byte
}

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
