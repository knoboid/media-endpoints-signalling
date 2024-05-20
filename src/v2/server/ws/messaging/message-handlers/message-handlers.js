import { processMessages } from "../../../../client-server-messaging/message-processing.js";

const { serverMessagingManager } = processMessages();

function messageHandlers(options) {
  serverMessagingManager.handle(options);
}

export default messageHandlers;
