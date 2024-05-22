import WebSocketClient from "./WebSocketClient.js";

class Endpoint extends WebSocketClient {
  constructor(id, clientType, webSocket) {
    super(id, clientType, webSocket);
  }

  isReceiver() {
    return this.getClientType() === "receiver";
  }

  isTransmitter() {
    return this.getClientType() === "transmitter";
  }
}

export default Endpoint;
