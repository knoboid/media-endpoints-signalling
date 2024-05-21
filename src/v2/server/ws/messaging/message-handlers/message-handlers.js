import { processMessages } from "../../../../client-server-messaging/message-processing.js";

const { serverMessagingManager } = processMessages();

export function messageHandlers(options) {
  serverMessagingManager.handle(options);
}

export function closedHandlers(options) {
  serverMessagingManager.handleClosed(options);
}
