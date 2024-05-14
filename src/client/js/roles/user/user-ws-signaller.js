import PayloadEvent from "../../payload-event.js";

const clientType = "user";

class UserWSSignaller extends EventTarget {
  constructor(url) {
    super();
    console.log("UserWSSignaller constructor");
    this.socket = new WebSocket(url);
    let messageCounter = 0;
    let userID;

    this.socket.onopen = (e) => {
      console.log("UserWSSignaller client OPENED");
    };
    //
    this.socket.onmessage = (message) => {
      const { type, payload } = JSON.parse(message.data);
      if (typeof type !== "string") {
        console.log("type should be string. Got:");
        console.log(typeof type);
        console.log(type);
        throw new Error("typeof type");
      }
      switch (messageCounter) {
        case 0:
          console.assert(type === "clientId");
          const id = payload.clientId;
          if (isNaN(id)) throw new TypeError("Expect a number");
          console.log(`Setting user id to ${id}`);
          this.id = id;
          this.socket.send(JSON.stringify({ id, clientType }));
          this.dispatchEvent(new PayloadEvent("getUserID", id));
          break;

        default:
          // const messageObject = JSON.parse(message.data);
          // const { type, payload } = messageObject;
          switch (type) {
            case "info":
              this.dispatchEvent(new PayloadEvent("info", payload));
              break;

            default:
              this.dispatchEvent(new PayloadEvent(type, payload));
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

export default UserWSSignaller;
