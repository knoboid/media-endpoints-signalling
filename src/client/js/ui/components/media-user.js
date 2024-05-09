import PayloadEvent from "../../payload-event.js";
import { appendContentTo } from "../util.js";
import UsersVideoMap from "../../ui/components/users-video-map.js";

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

    const h2 = appendContentTo(this, "h2", "");
    this.idElem = appendContentTo(h2, "span", "");
    h2.appendChild(this.idElem);
    this.showHideButton = document.createElement("button");
    this.showHideButton.innerHTML = "Show";
    this.showHideButton.style.marginLeft = "15px";
    this.showHideButton.disabled = true;
    this.showHideButton.onclick = () => this.handleShowHide();
    h2.appendChild(this.showHideButton);

    this.transmitterContainer = appendContentTo(this, "div", "");
    this.recieversContainer = appendContentTo(this, "div", "");
    this.videoMap = new UsersVideoMap(this.recieversContainer);
    this.usersTable = appendContentTo(this, "table", "");
    this.nameEntry = document.createElement("name-entry");
    // this.appendChild(this.streamButton);
    // this.appendChild(this.powerButton);
    this.appendChild(this.nameEntry);
    this.streamButton = appendContentTo(this, "hr", "");
    this.streamButton = appendContentTo(this, "button", "Start Stream");
    // this.addTransmitterButton = appendContentTo(
    //   this,
    //   "button",
    //   "Add Transmitter"
    // );
    this.appendChild(h2);
    this.appendChild(this.transmitterContainer);
    this.appendChild(this.recieversContainer);
    this.appendChild(this.usersTable);
    // this.idElem = shadow.querySelector("#id");
    // this.transmitterContainer = shadow.querySelector("#transmitter-container");
    // this.recieversContainer = shadow.querySelector("#recievers-container");
    // this.usersTable = shadow.querySelector("#users-table");
    this.isStarted = false;
    this.streamButton.onclick = (e) => this.handleStartStream(e);
    // this.addTransmitterButton.onclick = (e) => this.handleAddTransmitter(e);
    this.hasTransmitterVideo = false;
    this.transmitterVideoElement = null;
    this.streamStarted = false;
    this.stream = null;
    this.userId = null;
    this.nameEntry.addEventListener("usernameEntered", (e) => {
      const username = e.data;
      this.send("usernameEntered", username);
    });
  }

  handleAddTransmitter(e) {
    if (this.stream !== null) {
      this.send("addTransmitter", this.stream);
    }
  }

  handleStartStream(e) {
    console.log(this.stream);
    if (this.stream === null) {
      const constraints = {
        audio: true,
        video: true,
      };
      const startStream = (stream) => {
        this.stream = stream;
        this.streamButton.innerHTML = "Restart";
        this.streamButton.disabled = false;
        this.handleAddTransmitter();
      };
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then(startStream)
        .catch((e) => {
          console.log("Couldn't start stream");
          console.log(e);
          this.streamButton.disabled = false;
        });
      this.streamStarted = true;
      this.streamButton.disabled = true;
    } else {
      // location.reload();

      const tracks = this.stream.getTracks();
      tracks.forEach((track) => track.stop());
      this.stream = null;
      this.streamButton.innerHTML = "Start Stream";
    }
  }

  handleShowHide() {
    const d = this.video.style.display;
    this.video.style.display = d === "none" ? "inline" : "none";
    this.showHideButton.innerHTML = d === "none" ? "Hide" : "Show";
  }

  addVideo() {
    if (!this.hasTransmitterVideo) {
      const video = document.createElement("video");
      video.setAttribute("style", "width: 200px");
      video.setAttribute("playsinline", true);
      video.setAttribute("autoplay", true);
      video.setAttribute("controls", true);
      video.volume = 0;
      video.style.display = "none";
      this.transmitterVideoElement = video;
      this.transmitterContainer.innerHTML = "";
      this.transmitterContainer.appendChild(video);
      this.showHideButton.disabled = false;
      this.video = video; // Temporary
      // this.addTransmitterButton.disabled = true; // Temporary
      return video;
    }
  }

  addRecieverVideo(userId) {
    if (!this.videoMap.idExists(userId)) {
      return this.videoMap.addReciever(userId);
    } else {
      console.log(`Reciver already exists for user ${userId}`);
    }
  }

  setIDElement(name) {
    this.idElem.innerHTML = name;
  }

  setUserID(id) {
    // this.idElem.innerHTML = id;
    this.userId = id;
  }

  updateUsers(usersTable) {
    this.usersTable.innerHTML = "";
    const userRow = usersTable.filter((user) => user.id === this.userId)[0];
    const heading = document.createElement("tr");
    heading.innerHTML = "<th>User</th><th>Tranmitters</th><th>Receivers</th>";
    this.usersTable.appendChild(heading);
    usersTable.forEach((user) => {
      let content = "";
      const name = user.username || user.id;
      if (user.id === this.userId) {
        this.setIDElement(name);
      }
      content += `<td align="center">${name}</td>`;
      content += `<td align="center">[${user.transmitters.join(",")}]</td>`;
      // content += `<td>Transmitters: ${user.transmitterCount}</td>`;
      content += `<td align="center">[${user.receivers.join(",")}]</td>`;
      // content += `<td>Recievers: ${user.recieverCount}</td>`;
      const tr = appendContentTo(this.usersTable, "tr", content);
      userRow.transmitters.forEach((transmitterId) => {
        const button = document.createElement("button");
        button.innerHTML = `Call ${name}`;
        button.onclick = () => this.handleCall(user.id, transmitterId);
        tr.appendChild(button);
      });
    });
  }

  handleCall(userId, transmitterId) {
    console.log(userId);
    this.send("CALL", { userId, transmitterId });
  }

  send(name, data) {
    console.log(`dispatching ${name}`);
    this.dispatchEvent(new PayloadEvent(name, data));
  }

  resolve(type, data) {
    console.log("type");
    console.log(type);
    switch (type) {
      case "getUserID":
        this.setUserID(data);
        break;

      case "updateUsers":
        this.updateUsers(data);
        break;

      case "addVideo":
        return this.addVideo();

      case "addRecieverVideo":
        return this.addRecieverVideo(data);

      default:
        break;
    }
  }
}

export default MediaUserElement;