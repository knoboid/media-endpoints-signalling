import MessagingManager from "./messaging-manager.js";
import registerReceiverMessages from "../dialogues/registerReceiver.js";
import registerTransmitterMessages from "../dialogues/registerTransmitter.js";
import initiateCallMessages from "../dialogues/initiateCall.js";

const messages = [
  ...registerReceiverMessages,
  ...registerTransmitterMessages,
  ...initiateCallMessages,
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
