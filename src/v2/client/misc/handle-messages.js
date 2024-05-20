import { processMessages } from "../../client-server-messaging/message-processing.js";

const { clientMessagingManager } = processMessages();

function handleMessage(options) {
  clientMessagingManager.handle(options);
}

export default handleMessage;
