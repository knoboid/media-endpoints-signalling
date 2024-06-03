import ClientGroupMessasgingManager from "./client-group-messaging-manager.js";

class MessagingManager {
  constructor() {
    this.clientTypes = {};
  }

  addMessage(messageDefinition) {
    const { clientType } = messageDefinition;
    if (!(clientType in this.clientTypes)) {
      this.clientTypes[clientType] = new ClientGroupMessasgingManager(
        clientType
      );
    }
    const messagingManager = this.clientTypes[clientType];
    messagingManager.addMessage(messageDefinition);
  }

  handle(options) {
    if (options.clientType in this.clientTypes) {
      const messagingManager = this.clientTypes[options.clientType];
      if (options.messageCounter === 0) {
        if (messagingManager.zeroMessageHandler)
          messagingManager.zeroMessageHandler(options);
      } else {
        console.log(`Handle ${options.type} for ${options.clientType}`);
        messagingManager.handle(options.type, options);
      }
    } else {
      console.log(`Unhandled clientType ${options.clientType}`);
    }
  }

  handleClosed(options) {
    if (options.clientType in this.clientTypes) {
      const messagingManager = this.clientTypes[options.clientType];
      console.log(`${options.clientType} Closed!!!!!`);
      if (messagingManager.onCloseHandler)
        messagingManager.onCloseHandler(options);
    } else {
      console.log(`Unhandled onClose clientType ${options.clientType}`);
    }
  }
}

export default MessagingManager;
