package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

const (
	writeWait      = 10 * time.Second
	pongWait       = 60 * time.Second
	pingPeriod     = (pongWait * 9) / 10
	maxMessageSize = 512
)

var (
	newLine = []byte{'\n'}
	space   = []byte{' '}
)

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

type Client struct {
	hub      *Hub
	conn     *websocket.Conn
	send     chan []byte
	ip       string
	username string
}

type Message struct {
	MessageType string `json:"messageType"`
	Message     string `json:"message"`
	UserName    string `json:"userName"`
}

func unregisterClient(c *Client) {
	c.hub.unregister <- c
	c.conn.Close()
}

func (c *Client) readPump() {
	defer unregisterClient(c)
	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error { c.conn.SetReadDeadline(time.Now().Add(pongWait)); return nil })
	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		var parsedMessage Message
		message = bytes.TrimSpace(bytes.Replace(message, newLine, space, -1))
		err = json.Unmarshal([]byte(message), &parsedMessage)
		if err != nil {
			fmt.Println("Failed to parse message", err)
		}
		fmt.Printf("Parsed message %+v \n", parsedMessage)
		c.username = parsedMessage.UserName
		c.hub.broadcast <- []byte(message)
	}
}

func (c *Client) writePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()
	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// The hub closed the channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			// Add queued chat messages to the current websocket message.
			n := len(c.send)
			for i := 0; i < n; i++ {
				w.Write(newLine)
				w.Write(<-c.send)
			}

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}

func wsHandler(c *gin.Context, hub *Hub) {
	c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
	upgrader.CheckOrigin = func(r *http.Request) bool {
		return true
	}
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println(err)
		return
	}
	client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256), ip: c.Request.Header.Get("X-Real-Ip")}
	client.hub.register <- client
	fmt.Println("Current clients connected")
	for c := range hub.clients {
		var userName string
		if c.username == "" {
			userName = "Unknown"
		} else {
			userName = c.username
		}
		fmt.Println(c.ip, userName)
	}

	go client.writePump()
	go client.readPump()
}
