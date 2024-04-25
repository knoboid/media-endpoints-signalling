import PayloadEvent from "../../payload-event.js";
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
          this.dispatchEvent(new PayloadEvent("onGotResponderID", id));
          break;

        default:
          const messageObject = JSON.parse(message.data);
          const { type, payload } = messageObject;
          switch (type) {
            case "info":
              console.log(payload);
              break;

            case "initiateResponse":
              /* Some else has initiated a call */
              console.log("initiateResponse");
              console.log(payload);
              this.dispatchEvent(new PayloadEvent("initiateResponse", payload));
              break;

            case "fromCaller":
              console.log("got fromCaller");
              console.log(payload);
              this.dispatchEvent(new PayloadEvent("fromCaller", payload));
              break;

            case "terminated":
              console.log("got terminated");
              this.dispatchEvent(new PayloadEvent("terminated"));
              break;

            default:
              console.log(
                `responder signaller got unhandled message type ${type}`
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

  responder(message) {
    this.send({ type: "fromResponder", payload: message });
  }
}

export default ResponderSignaller;
