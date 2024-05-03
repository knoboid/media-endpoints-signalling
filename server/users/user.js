class User {
  constructor(clientId, client) {
    this.clientId = clientId;
    this.client = client;
  }

  getSocket() {
    return this.client;
  }
}

module.exports = User;
