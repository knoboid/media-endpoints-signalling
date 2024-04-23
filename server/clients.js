class Clients {
  constructor() {
    this.clients = {};
  }

  addCLient(id, client) {
    this.clients[id] = client;
  }
}

module.exports = Clients;
