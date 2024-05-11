class User {
  constructor(clientId, client) {
    this.clientId = clientId;
    this.client = client;
    this.transmitters = [];
    this.recievers = [];
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

  addReciever(recieverId) {
    this.recievers.push(recieverId);
  }

  setUsername(username) {
    this.username = username;
  }
}

module.exports = User;