class Clients {
  constructor() {
    this.clients = {};
  }

  addCLient(id, client, status) {
    this.clients[id] = { client, status };
  }

  getList() {
    return Object.keys(this.clients).map((id) => {
      const client = this.clients[id];
      return { id, status: client.status };
    });
  }

  getClients() {
    return Object.values(this.clients).map((obj) => obj.client);
  }
}

module.exports = Clients;
