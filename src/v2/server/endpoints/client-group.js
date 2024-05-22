class ClientGroup {
  constructor() {
    this.clients = {};
  }

  isMember(id) {
    return this.contains(id);
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
    this.clients[id] = { webSocket, status, otherPartyID: null, name: null };
  }

  getList() {
    return Object.keys(this.clients).map((id) => {
      const { status, name } = this.clients[id];
      return { id, status, name };
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

  setName(id, name) {
    const client = (this.clients[id].name = name);
  }

  ids() {
    return Object.keys(this.clients);
  }

  isInGroup(id) {
    return this.ids().includes(id);
  }

  isAvailable(id) {
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
