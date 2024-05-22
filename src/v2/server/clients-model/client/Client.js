class Client {
  constructor(id, clientType) {
    this.id = id;
    this.clientType = clientType;
  }

  getId() {
    return this.id;
  }

  getClientType() {
    return this.clientType;
  }
}

export default Client;
