import MessagingManager from "./messaging-manager.js";
import registerRecieverMessages from "../dialogues/registerReceiver.js";
import registerTransmitterMessages from "../dialogues/registerTransmitter.js";
import initiateCallMessages from "../dialogues/initiateCall.js";
const serverMessagingManager = new MessagingManager();
const clientMessagingManager = new MessagingManager();

const messages = [
  ...registerRecieverMessages,
  ...registerTransmitterMessages,
  ...initiateCallMessages,
];

export function processMessages() {
  messages.forEach((message) => {
    if (message.server) {
      serverMessagingManager.addMessage(message);
    } else {
      clientMessagingManager.addMessage(message);
    }
  });
  return { serverMessagingManager, clientMessagingManager };
}
