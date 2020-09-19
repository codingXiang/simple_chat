package main

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"gopkg.in/olahol/melody.v1"
	"net/http"
)

type Message struct {
	Event   string `json:"event"`
	Name    string `json:"name"`
	Content string `json:"content"`
}

func NewMessage(event, name, content string) *Message {
	return &Message{
		Event:   event,
		Name:    name,
		Content: content,
	}
}

func (m *Message) GetByteMessage() []byte {
	result, _ := json.Marshal(m)
	return result
}

func main() {
	r := gin.Default()
	r.LoadHTMLGlob("template/html/*")
	r.Static("/assets", "./template/assets")
	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	m := melody.New()
	r.GET("/ws", func(c *gin.Context) {
		m.HandleRequest(c.Writer, c.Request)
	})

	m.HandleMessage(func(s *melody.Session, msg []byte) {
		m.Broadcast(msg)
	})

	m.HandleConnect(func(session *melody.Session) {
		id := session.Request.URL.Query().Get("id")
		m.Broadcast(NewMessage("other", id, "加入聊天室").GetByteMessage())
	})

	m.HandleClose(func(session *melody.Session, i int, s string) error {
		id := session.Request.URL.Query().Get("id")
		m.Broadcast(NewMessage("other", id, "離開聊天室").GetByteMessage())
		return nil
	})
	r.Run(":5000")
}
