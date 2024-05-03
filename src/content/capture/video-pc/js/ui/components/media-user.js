import PayloadEvent from "../../payload-event.js";
import { appendContentTo } from "../util.js";

const template = document.createElement("template");
template.innerHTML = `
<button id="onoff-button">START</button>
<h2>ID: <span id="id"></span></h2>
<div id="transmitter-container"><div>
<div id="recievers-container"><div>
<table id="users-table"><table>
`;

class MediaUserElement extends HTMLElement {
  constructor() {
    super();
    // const shadow = this.attachShadow({ mode: "open" });
    // shadow.append(template.content.cloneNode(true));
    // this.powerButton = shadow.querySelector("#onoff-button");
    this.powerButton = appendContentTo(this, "button", "START");
    const h2 = appendContentTo(this, "h2", "ID: ");
    this.idElem = appendContentTo(h2, "span", "");
    h2.appendChild(this.idElem);
    this.transmitterContainer = appendContentTo(this, "div", "");
    this.recieversContainer = appendContentTo(this, "div", "");
    this.usersTable = appendContentTo(this, "table", "");
    this.appendChild(this.powerButton);
    this.appendChild(h2);
    this.appendChild(this.transmitterContainer);
    this.appendChild(this.recieversContainer);
    this.appendChild(this.usersTable);
    // this.idElem = shadow.querySelector("#id");
    // this.transmitterContainer = shadow.querySelector("#transmitter-container");
    // this.recieversContainer = shadow.querySelector("#recievers-container");
    // this.usersTable = shadow.querySelector("#users-table");
    this.isStarted = false;
    this.powerButton.onclick = (e) => this.handleTogglePower(e);
    this.hasTransmitterVideo = false;
    this.transmitterVideoElement = null;
  }

  addVideo() {
    if (!this.hasTransmitterVideo) {
      const video = document.createElement("video");
      video.setAttribute("style", "width: 200px");
      video.setAttribute("playsinline", true);
      video.setAttribute("autoplay", true);
      video.setAttribute("controls", true);
      video.volume = 0;
      this.transmitterVideoElement = video;
      this.transmitterContainer.innerHTML = "";
      this.transmitterContainer.appendChild(video);
      return video;
    }
  }

  setUserID(id) {
    this.idElem.innerHTML = id;
  }

  updateUsers(usersTable) {
    this.usersTable.innerHTML = "";
    usersTable.forEach((user) => {
      let content = "";
      content += `<td>User: ${user.id}</td>`;
      content += `<td>Transmitter: ${
        typeof user.transmitter !== "undefined"
      }</td>`;

      appendContentTo(this.usersTable, "tr", content);
    });
  }

  handleTogglePower(e) {
    this.isStarted = !this.isStarted;
    this.powerButton.innerHTML = this.isStarted ? "STOP" : "START";
    this.send(this.isStarted ? "START" : "STOP");
  }

  send(name, data) {
    console.log(`dispatching ${name}`);
    this.dispatchEvent(new PayloadEvent(name, data));
  }

  resolve(type, data) {
    console.log("type");
    console.log(type);
    switch (type) {
      case "onGotUserID":
        this.setUserID(data);
        break;

      case "updateUsers":
        this.updateUsers(data);
        break;

      case "addVideo":
        return this.addVideo();
        break;

      default:
        break;
    }
  }
}

export default MediaUserElement;
