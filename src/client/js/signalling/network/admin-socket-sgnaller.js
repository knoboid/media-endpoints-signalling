import PayloadEvent from "../../payload-event.js";

const clientType = "admin";

class AdminSignaller extends EventTarget {
  constructor(url) {
    super();
    this.socket = new WebSocket(url);
    let messageCounter = 0;

    this.socket.onopen = (e) => {
      console.log("ADMIN SOCKET OPENED");
    };

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
          console.log(`Setting id to ${id}`);
          this.id = id;
          this.socket.send(JSON.stringify({ id, clientType }));
          this.dispatchEvent(new PayloadEvent("onGotAdminID", id));
          break;

        default:
          // const messageObject = JSON.parse(message.data);
          // const { type, payload } = messageObject;
          switch (type) {
            case "password":
              this.dispatchEvent(new PayloadEvent("password"));
              break;

            case "authenticated":
              this.relay(type, payload);
              break;

            case "updateUsers":
              this.relay(type, payload);
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

  relay(type, payload) {
    this.dispatchEvent(new PayloadEvent(type, payload));
  }

  send(request) {
    this.socket.send(JSON.stringify(request));
  }
}

export default AdminSignaller;
