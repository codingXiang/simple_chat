const LEFT = "left";
const RIGHT = "right";

const userPhotos = [
    "https://www.flaticon.com/svg/static/icons/svg/3408/3408584.svg",
    "https://www.flaticon.com/svg/static/icons/svg/3408/3408537.svg",
    "https://www.flaticon.com/svg/static/icons/svg/3408/3408540.svg",
    "https://www.flaticon.com/svg/static/icons/svg/3408/3408545.svg",
    "https://www.flaticon.com/svg/static/icons/svg/3408/3408551.svg",
    "https://www.flaticon.com/svg/static/icons/svg/3408/3408556.svg",
    "https://www.flaticon.com/svg/static/icons/svg/3408/3408564.svg",
    "https://www.flaticon.com/svg/static/icons/svg/3408/3408571.svg",
    "https://www.flaticon.com/svg/static/icons/svg/3408/3408578.svg",
    "https://www.flaticon.com/svg/static/icons/svg/3408/3408720.svg"
]
var PERSON_IMG = userPhotos[getRandomNum(0, userPhotos.length)];
var PERSON_NAME = "Guest" + Math.floor(Math.random() * 1000);

var url = "ws://" + window.location.host + "/ws";
var ws = new WebSocket(url);
var name = "Guest" + Math.floor(Math.random() * 1000);
var chatroom = document.getElementsByClassName("msger-chat")
var text = document.getElementById("msg");


text.onkeydown = function (e) {
    if (e.keyCode === 13 && text.value !== "") {
        ws.send(JSON.stringify({
            "photo": PERSON_IMG,
            "name": PERSON_NAME,
            "content": text.value,
        }));
        text.value = "";
    }
};

ws.onmessage = function (e) {
    var msg = JSON.parse(e.data)
    if (msg.name == PERSON_NAME) {
        msg = getMessage(msg.name, msg.photo, RIGHT, msg.content);
    } else {
        msg = getMessage(msg.name, msg.photo, LEFT, msg.content);
    }
    insertMsg(msg, chatroom[0]);
};

function getMessage(name, img, side, text) {
    const d = new Date()
    //   Simple solution for small apps
    var msg = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>

      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${d.getFullYear()}/${d.getMonth()}/${d.getDay()} ${d.getHours()}:${d.getMinutes()}</div>
        </div>

        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;
    return msg;
}

function insertMsg(msg, domObj) {
    domObj.insertAdjacentHTML("beforeend", msg);
    domObj.scrollTop += 500;
}

function getRandomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}