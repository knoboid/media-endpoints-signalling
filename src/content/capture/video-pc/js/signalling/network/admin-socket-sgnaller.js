import PayloadEvent from "../../payload-event.js";

const clientType = "admin";

class AdminSignaller extends EventTarget {
  constructor(url) {
    super();
    this.socket = new WebSocket(url);
    let messageCounter = 0;

    this.socket.onopen = (e) => {
      console.log("SOCKET OPENED");
    };

    this.socket.onmessage = (message) => {
      switch (messageCounter) {
        case 0:
          const id = Number(message.data);
          if (isNaN(id)) throw new TypeError("Expect a number");
          console.log(`Setting id to ${id}`);
          this.id = id;
          this.socket.send(JSON.stringify({ id, clientType }));
          this.dispatchEvent(new PayloadEvent("onGotAdminID", id));
          break;

        default:
          const messageObject = JSON.parse(message.data);
          const { type, payload } = messageObject;
          switch (type) {
            case "password":
              console.log("password!");
              console.log(payload);
              this.dispatchEvent(new PayloadEvent("password"));
              break;

            case "authenticated":
              this.dispatchEvent(
                new PayloadEvent("authenticated", payload.data)
              );
              break;

            default:
              console.log(
                `reciever signaller got unhandled message type ${type}`
              );
              break;
          }
          break;
      }
      messageCounter++;
    };
  }

  send(request) {
    this.socket.send(JSON.stringify(request));
  }
}

export default AdminSignaller;
