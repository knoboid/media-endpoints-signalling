import PayloadEvent from "../../payload-event.js";
const clientType = "caller";

class CallerSignaller extends EventTarget {
  constructor(url) {
    super();
    this.socket = new WebSocket(url);
    let messageCounter = 0;
    let responderID;

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
          this.dispatchEvent(new PayloadEvent("onGotCallerID", id));
          break;

        default:
          const messageObject = JSON.parse(message.data);
          const { type, payload } = messageObject;
          switch (type) {
            case "info":
              this.dispatchEvent(new PayloadEvent("info", payload));
              break;
            case "updateResponders":
              const { responders } = payload;
              this.dispatchEvent(
                new PayloadEvent("onUpdateResponders", responders)
              );
              break;
            case "initiateCallSuccess":
              responderID = payload.responderID;
              this.dispatchEvent(
                new PayloadEvent("initiateCallSuccess", { responderID })
              );
              break;
            case "initiateCallFailure":
              this.dispatchEvent(
                new PayloadEvent("initiateCallFailure", { responderID })
              );
              break;

            case "fromResponder":
              this.dispatchEvent(new PayloadEvent("fromResponder", payload));
              break;

            case "terminated":
              this.dispatchEvent(new PayloadEvent("terminated"));
              break;

            default:
              console.log(
                `caller signaller got unhandled message type ${type}`
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

  caller(message) {
    this.send({ type: "fromCaller", payload: message });
  }
}

export default CallerSignaller;
