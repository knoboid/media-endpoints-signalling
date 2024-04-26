class Clients {
  constructor() {
    this.clients = {};
  }

  contains(id) {
    return this.clients[id] ? true : false;
  }

  getClient(id) {
    return this.clients[id].client;
  }

  getStatus(id) {
    return this.clients[id].status;
  }

  addClient(id, client, status) {
    this.clients[id] = { client, status, otherPartyID: null };
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

  remove(id) {
    delete this.clients[id];
  }

  setStatus(id, status) {
    const client = (this.clients[id].status = status);
  }

  isAvailable(id) {
    console.log(id, this.getStatus(id));
    return this.getStatus(id) === "available";
  }

  isBusy(id) {
    return this.getStatus(id) === "busy";
  }

  setAvailable(id) {
    this.setStatus("available");
  }

  setBusy(id) {
    this.setStatus("busy");
  }
}

module.exports = Clients;
