// import PayloadEvent from "../payload-event.js";
const clientType = "responder";

class ResponderSignaller extends EventTarget {
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
          break;

        default:
          const messageObject = JSON.parse(message.data);
          console.log("Got messasge");
          const { type, payload } = messageObject;
          switch (type) {
            case "info":
              console.log(payload);
              break;

            default:
              break;
          }
          break;
      }
      messageCounter++;
    };
    // this.signallingChannel = signallingChannel;
    // this.signallingChannel.addEventListener("fromCaller", (event) =>
    //   this.dispatchEvent(new PayloadEvent("fromCaller", event.data))
    // );
  }

  send(request) {
    this.socket.send(JSON.stringify(request));
  }

  responder(data) {
    this.signallingChannel.responder(data);
  }
}

export default ResponderSignaller;
