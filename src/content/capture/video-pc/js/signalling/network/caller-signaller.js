import PayloadEvent from "../../payload-event.js";
const clientType = "caller";

class CallerSignaller extends EventTarget {
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
            case "updateResponders":
              const { responders } = payload;
              console.log(payload.responders);
              this.dispatchEvent(
                new PayloadEvent("onUpdateResponders", responders)
              );
              break;

            default:
              break;
          }
          break;
      }
      messageCounter++;
    };
    // this.signallingChannel = signallingChannel;
    // this.signallingChannel.addEventListener("fromResponder", (event) =>
    //   this.dispatchEvent(new PayloadEvent("fromResponder", event.data))
    // );
  }

  send(request) {
    this.socket.send(JSON.stringify(request));
  }

  caller(data) {
    // this.signallingChannel.caller(data);
  }
}

export default CallerSignaller;
