import MessagingManager from "./messaging-manager.js";
import registerReceiverMessages from "../../../../client-server-messaging/dialogues/registerReceiver.js";
import registerTransmitterMessages from "../../../../client-server-messaging/dialogues/registerTransmitter.js";
import initiateCallMessages from "../../../../client-server-messaging/dialogues/initiateCall.js";
import getDataMessages from "../../../../client-server-messaging/dialogues/getData.js";

const messages = [
  ...registerReceiverMessages,
  ...registerTransmitterMessages,
  ...initiateCallMessages,
  ...getDataMessages,
];

export function processMessages() {
  const serverMessagingManager = new MessagingManager();
  const clientMessagingManager = new MessagingManager();

  messages.forEach((message) => {
    if (message.server) {
      serverMessagingManager.addMessage(message);
    } else {
      clientMessagingManager.addMessage(message);
    }
  });
  return { serverMessagingManager, clientMessagingManager };
}
