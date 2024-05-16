class User {
  constructor(clientId, client) {
    this.clientId = clientId;
    this.client = client;
    this.transmitters = [];
    this.receivers = [];
    this.username = "";
  }

  getSocket() {
    return this.client;
  }

  addTransmitter(transmitterId) {
    this.transmitters.push(transmitterId);
  }

  ownsTransmitter(transmitterId) {
    return this.transmitters.includes(transmitterId);
  }

  addReciever(receiverId) {
    this.receivers.push(receiverId);
  }

  setUsername(username) {
    this.username = username;
  }
}

module.exports = User;
