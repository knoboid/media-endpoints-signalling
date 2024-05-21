import PayloadEvent from "../misc/payload-event.js";
import handleMessage from "../misc/handle-messages.js";
const clientType = "dataViewer";

class DataViewerSignaller extends EventTarget {
  constructor(url) {
    super();
    const webSocket = new WebSocket(url);
    this.socket = webSocket;
    let messageCounter = 0;
    this.data = {};
    webSocket.onopen = (e) => {
      console.log("SOCKET OPENED");
    };

    webSocket.onmessage = (message) => {
      console.log("Data Viewer");
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
}

export default DataViewerSignaller;
