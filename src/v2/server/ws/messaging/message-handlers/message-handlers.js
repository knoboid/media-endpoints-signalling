import { processMessages } from "../message-processing/message-processing.js";

const { serverMessagingManager } = processMessages();

function messageHandlers(options) {
  serverMessagingManager.handle(options);
}

export default messageHandlers;
