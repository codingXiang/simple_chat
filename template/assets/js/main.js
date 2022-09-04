const LEFT = "left";
const RIGHT = "right";

const EVENT_MESSAGE = "message"
const EVENT_OTHER = "other"

const userPhotos = [
    "https://cdn-icons-png.flaticon.com/512/4825/4825038.png",
    "https://cdn-icons-png.flaticon.com/512/4825/4825112.png",
    "https://cdn-icons-png.flaticon.com/512/4825/4825015.png",
    "https://cdn-icons-png.flaticon.com/512/4825/4825044.png",
    "https://cdn-icons-png.flaticon.com/512/4825/4825082.png",
    "https://cdn-icons-png.flaticon.com/512/4825/4825087.png",
]
var PERSON_IMG = userPhotos[getRandomNum(0, userPhotos.length - 1)];
var PERSON_NAME = "Guest" + Math.floor(Math.random() * 1000);

var url = "ws://" + window.location.host + "/ws?id=" + PERSON_NAME;
var ws = new WebSocket(url);
var name = "Guest" + Math.floor(Math.random() * 1000);
var chatroom = document.getElementsByClassName("msger-chat")
var text = document.getElementById("msg");
var send = document.getElementById("send")

send.onclick = function (e) {
    handleMessageEvent()
}

text.onkeydown = function (e) {
    if (e.keyCode === 13 && text.value !== "") {
        handleMessageEvent()
    }
};

ws.onmessage = function (e) {
    var m = JSON.parse(e.data)
    var msg = ""
    switch (m.event) {
        case EVENT_MESSAGE:
            if (m.name == PERSON_NAME) {
                msg = getMessage(m.name, m.photo, RIGHT, m.content);
            } else {
                msg = getMessage(m.name, m.photo, LEFT, m.content);
            }
            break;
        case EVENT_OTHER:
            if (m.name != PERSON_NAME) {
                msg = getEventMessage(m.name + " " + m.content)
            } else {
                msg = getDateMessage(formatDate(m.timestamp))
                msg += getEventMessage("您已" + m.content)
            }
            break;
    }
    insertMsg(msg, chatroom[0]);
};

ws.onclose = function (e) {
    console.log(e)
}

function handleMessageEvent() {
    // encode html tag
    content = text.value.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    if (text.value != "") {
        ws.send(JSON.stringify({
            "event": "message",
            "photo": PERSON_IMG,
            "name": PERSON_NAME,
            "content": content,
        }));
    }
    text.value = "";
}

function getEventMessage(msg) {
    var msg = `<div class="msg-notify">${msg}</div>`
    return msg
}

function getDateMessage(msg) {
    var msg = `<div class="msg-date"><span class="time-tag">${msg}</span></div>`
    return msg
}

function formatDate(d) {
    return d.split('T')[0];
}

function formatTime(d) {
    return d.toLocaleString('zh-TW', {
        timeZone: 'Asia/Taipei',
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).replaceAll("/", "-");
}

function getMessage(name, img, side, text) {
    const d = new Date();
    //   Simple solution for small apps
    var msg = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatTime(d)}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `
    return msg;
}

function insertMsg(msg, domObj) {
    domObj.insertAdjacentHTML("beforeend", msg);
    domObj.scrollTop += 500;
}

function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}