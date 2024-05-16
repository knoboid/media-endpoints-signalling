import PayloadEvent from "../../payload-event.js";
import handleMessage from "./process/handle-messages.js";
const clientType = "receiver";

class ReceiverSignaller extends EventTarget {
  constructor(url, code) {
    super();
    const webSocket = new WebSocket(url);
    this.socket = webSocket;
    let messageCounter = 0;
    this.data = {};

    webSocket.onopen = (e) => {
      console.log("SOCKET OPENED");
    };

    webSocket.onmessage = (message) => {
      const { type, payload } = JSON.parse(message.data);
      console.assert(typeof type === "string");
      handleMessage({
        messageCounter,
        clientId: this.id,
        webSocket,
        data: this.data,
        dispatch: (type, payload) => this.dispatch(type, payload),
        clientType,
        message,
        type,
        payload,
      });

      switch (type) {
        case "info":
          console.log(payload);
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
    this.send({ type: "fromReceiver", payload: message });
  }
}

export default ReceiverSignaller;
