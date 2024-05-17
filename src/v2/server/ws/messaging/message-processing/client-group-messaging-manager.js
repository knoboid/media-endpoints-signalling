class ClientGroupMessasgingManager {
  constructor(clientGroup) {
    this.clientGroup = clientGroup;
    this.types = {};
  }

  addMessage({ zeroMessage, type, handler }) {
    if (zeroMessage) {
      if (this.zeroMessage) {
        throw new Error(
          `zeroMessage cannot be defined more than once: client group, ${this.clientGroup}`
        );
      }
      this.zeroMessageHandler = handler;
    } else {
      console.log(`Adding ${type} to ${this.clientGroup}`);
      if (type in this.types) {
        throw new Error(
          `Type ${type} in ${this.clientGroup} cannot be defined more than once`
        );
      } else {
        this.types[type] = handler;
      }
    }
  }

  handle(type, options) {
    if (type in this.types) {
      this.types[type](options);
    } else {
      console.log(`Unhandled type ${type} in ${this.clientGroup}`);
    }
  }
}

export default ClientGroupMessasgingManager;
