package main

import (
	"encoding/json"
	"github.com/gin-gonic/gin"
	"gopkg.in/olahol/melody.v1"
	"net/http"
)

func main() {
	r := gin.Default()
	r.LoadHTMLGlob("template/html/*")
	//設定靜態資源的讀取
	r.Static("/assets", "./template/assets")

	m := melody.New()

	r.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "index.html", nil)
	})

	r.GET("/ws", func(c *gin.Context) {
		m.HandleRequest(c.Writer, c.Request)
	})

	m.HandleMessage(func(s *melody.Session, msg []byte) {
		m.Broadcast(msg)
	})

	m.HandleConnect(func(session *melody.Session) {
		id := session.Request.URL.Query().Get("id")
		tmp := map[string]string{
			"event":   "other",
			"name":    id,
			"content": "加入聊天室",
		}
		obj, _ := json.Marshal(tmp)
		m.Broadcast(obj)
	})

	m.HandleClose(func(session *melody.Session, i int, s string) error {
		id := session.Request.URL.Query().Get("id")
		tmp := map[string]string{
			"event":   "other",
			"name":    id,
			"content": "離開聊天室",
		}
		obj, _ := json.Marshal(tmp)
		m.Broadcast(obj)
		return nil
	})
	r.Run(":5000")
}
