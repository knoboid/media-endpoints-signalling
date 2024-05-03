class User {
  constructor(clientId, client) {
    this.clientId = clientId;
    this.client = client;
    this.transmitters = [];
    this.recievers = [];
  }

  getSocket() {
    return this.client;
  }

  addTransmitter(transmitter) {
    this.transmitters.push(transmitter);
  }
}

module.exports = User;
