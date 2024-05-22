import WebSocketClient from "./WebSocketClient.js";

class Endpoint extends WebSocketClient {
  constructor(id, clientType, webSocket) {
    super(id, clientType, webSocket);
    this.otherParty = null;
  }

  isReceiver() {
    return this.getClientType() === "receiver";
  }

  isTransmitter() {
    return this.getClientType() === "transmitter";
  }

  getOtherParty() {
    return this.otherParty;
  }

  getObject() {
    return { ...super.getObject(), otherParty: this.getOtherParty() };
  }
}

export default Endpoint;
