import PayloadEvent from "../misc/payload-event.js";
import handleMessage from "../misc/handle-messages.js";
const clientType = "transmitter";

class TransmitterSignaller extends EventTarget {
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
        clientId: this.data.id,
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
          this.dispatchEvent(new PayloadEvent("info", payload));
          break;
        case "updateReceivers":
          const { receivers } = payload;
          this.dispatchEvent(new PayloadEvent("onUpdateReceivers", receivers));
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
