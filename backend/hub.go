package main

import "encoding/json"

type Hub struct {
	clients map[*Client]bool

	broadcast chan []byte

	register chan *Client

	unregister chan *Client
}

type Message struct {
	MessageType string   `json:"messageType"`
	Message     string   `json:"message"`
	UserList    []string `json:"userList"`
	UserName    string   `json:"userName"`
}

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *Hub) broadcastMessage(message []byte) {
	for client := range h.clients {
		select {
		case client.send <- message:
		default:
			close(client.send)
			delete(h.clients, client)
		}
	}
}

func (h *Hub) broadcastUserList() {
	var userList []string
	for c, v := range h.clients {
		if v == true {
			userList = append(userList, c.username)
		}
	}
	userListMessage := Message{MessageType: "userList", UserList: userList}
	userListJson, _ := json.Marshal(userListMessage)
	h.broadcastMessage([]byte(userListJson))

}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
			h.broadcastUserList()
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		case message := <-h.broadcast:
			h.broadcastMessage(message)

		}
	}
}
