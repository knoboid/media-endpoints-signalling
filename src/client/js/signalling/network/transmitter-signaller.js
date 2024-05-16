import PayloadEvent from "../../payload-event.js";
import handleMessage from "./process/handle-messages.js";
const clientType = "transmitter";

class TransmitterSignaller extends EventTarget {
  constructor(url, code) {
    super();
    this.socket = new WebSocket(url);
    let messageCounter = 0;
    let receiverID;

    this.socket.onopen = (e) => {
      console.log("SOCKET OPENED");
    };

    this.socket.onmessage = (message) => {
      const { type, payload } = JSON.parse(message.data);
      if (typeof type !== "string") {
        console.log("type should be string. Got:");
        console.log(typeof type);
        console.log(type);
        throw new Error("typeof type");
      }
      console.assert(typeof type === "string");
      handleMessage({
        messageCounter,
        clientId: this.id,
        webSocket: this.socket,
        self: this,
        clientType,
        message,
        type,
        payload,
      });
      switch (messageCounter) {
        case 0:
          // console.assert(type === "clientId");
          // const id = payload.clientId;
          // // const id = Number(message.data);
          // if (isNaN(id)) throw new TypeError("Expect a number");
          // console.log(`Setting id to ${id}`);
          // this.id = id;
          // this.socket.send(JSON.stringify({ id, clientType, code }));
          // this.dispatchEvent(new PayloadEvent("onGotTransmitterID", id));
          break;

        default:
          // const messageObject = JSON.parse(message.data);
          // const { type, payload } = messageObject;
          switch (type) {
            case "info":
              this.dispatchEvent(new PayloadEvent("info", payload));
              break;
            case "updateRecievers":
              const { receivers } = payload;
              this.dispatchEvent(
                new PayloadEvent("onUpdateRecievers", receivers)
              );
              break;
            case "initiateCallSuccess":
              receiverID = payload.receiverID;
              this.dispatchEvent(
                new PayloadEvent("initiateCallSuccess", { receiverID })
              );
              break;
            case "initiateCallFailure":
              this.dispatchEvent(
                new PayloadEvent("initiateCallFailure", { receiverID })
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

  dispatch(type, payload) {
    this.dispatchEvent(new PayloadEvent(type, payload));
  }

  send(request) {
    this.socket.send(JSON.stringify(request));
  }

  transmitter(message) {
    this.send({ type: "fromTransmitter", payload: message });
  }
}

export default TransmitterSignaller;
