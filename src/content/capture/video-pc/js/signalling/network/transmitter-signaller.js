import PayloadEvent from "../../payload-event.js";
const clientType = "transmitter";

class TransmitterSignaller extends EventTarget {
  constructor(url) {
    super();
    this.socket = new WebSocket(url);
    let messageCounter = 0;
    let recieverID;

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
          this.dispatchEvent(new PayloadEvent("onGotTransmitterID", id));
          break;

        default:
          const messageObject = JSON.parse(message.data);
          const { type, payload } = messageObject;
          switch (type) {
            case "info":
              this.dispatchEvent(new PayloadEvent("info", payload));
              break;
            case "updateRecievers":
              const { recievers } = payload;
              this.dispatchEvent(
                new PayloadEvent("onUpdateRecievers", recievers)
              );
              break;
            case "initiateCallSuccess":
              recieverID = payload.recieverID;
              this.dispatchEvent(
                new PayloadEvent("initiateCallSuccess", { recieverID })
              );
              break;
            case "initiateCallFailure":
              this.dispatchEvent(
                new PayloadEvent("initiateCallFailure", { recieverID })
              );
              break;

            case "fromReciever":
              this.dispatchEvent(new PayloadEvent("fromReciever", payload));
              break;

            case "terminated":
              this.dispatchEvent(new PayloadEvent("terminated"));
              break;

            default:
              console.log(
                `transmitter signaller got unhandled message type ${type}`
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

  transmitter(message) {
    this.send({ type: "fromTransmitter", payload: message });
  }
}

export default TransmitterSignaller;
