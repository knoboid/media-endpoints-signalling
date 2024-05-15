class ClientGroup {
  constructor() {
    this.clients = {};
  }

  contains(id) {
    return this.clients[id] ? true : false;
  }

  getWebSocket(id) {
    return this.clients[id].webSocket;
  }

  getStatus(id) {
    return this.clients[id].status;
  }

  addClient(id, webSocket, status) {
    this.clients[id] = { webSocket, status, otherPartyID: null };
  }

  getList() {
    return Object.keys(this.clients).map((id) => {
      const client = this.clients[id];
      return { id, status: client.status };
    });
  }

  getWebSockets() {
    return Object.values(this.clients).map((obj) => obj.webSocket);
  }

  remove(id) {
    delete this.clients[id];
  }

  setStatus(id, status) {
    const client = (this.clients[id].status = status);
  }

  ids() {
    return Object.keys(this.clients);
  }

  isInGroup(id) {
    return this.ids().includes(id);
  }

  isAvailable(id) {
    // Fix this in rewrite
    if (!this.isInGroup(id.toString())) return false;
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

export default ClientGroup;
