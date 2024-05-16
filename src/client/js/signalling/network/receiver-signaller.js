import PayloadEvent from "../../payload-event.js";
import handleMessage from "./process/handle-messages.js";
const clientType = "receiver";

class RecieverSignaller extends EventTarget {
  constructor(url, code) {
    super();
    this.socket = new WebSocket(url);
    let messageCounter = 0;
    // let clientId;

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
          break;

        default:
          // const messageObject = JSON.parse(message.data);
          switch (type) {
            case "info":
              console.log(payload);
              break;

            case "receiverRegistered":
              // this.dispatchEvent(
              //   new PayloadEvent("receiverRegistered", this.id)
              // );
              break;

            case "newConnectionRequest":
              /* Some else has initiated a call */
              // console.log("newConnectionRequest");
              // console.log(payload);
              // this.dispatchEvent(
              //   new PayloadEvent("newConnectionRequest", payload)
              // );
              break;

            case "fromTransmitter":
              // console.log("got fromTransmitter");
              // console.log(payload);
              // this.dispatchEvent(new PayloadEvent("fromTransmitter", payload));
              break;

            case "terminated":
              // console.log("got terminated");
              // this.dispatchEvent(new PayloadEvent("terminated"));
              break;

            default:
              console.log(
                `receiver signaller got unhandled message type ${type}`
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

  receiver(message) {
    this.send({ type: "fromReciever", payload: message });
  }
}

export default RecieverSignaller;
