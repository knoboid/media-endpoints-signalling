class Peer {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  setPeerConnection(connection) {
    this.connection = connection;
  }

  getPeerConnection() {
    if (!this.connection)
      throw new Error("Connection is not set for " + this.name);
    return this.connection;
  }
}

export default Peer;
