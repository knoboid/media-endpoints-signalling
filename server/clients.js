class Clients {
  constructor() {
    this.clients = {};
  }

  addCLient(id, client, state) {
    this.clients[id] = { client, state };
  }

  getList() {
    return Object.keys(this.clients).map((id) => {
      const client = this.clients[id];
      return { id, state: client.state };
    });
  }
}

module.exports = Clients;
