import Client from "./Client.js";

class WebSocketClient extends Client {
  constructor(id, clientType, webSocket) {
    super(id, clientType);
    this.webSocket = webSocket;
  }

  getWebSocket() {
    return this.webSocket;
  }
}

export default WebSocketClient;
