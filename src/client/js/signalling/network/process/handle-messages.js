import { processMessages } from "../../../../../v2/server/ws/messaging/message-processing/message-processing.js";

const { clientMessagingManager } = processMessages();

function handleMessage(options) {
  console.log("--------------------@@--------------------");
  clientMessagingManager.handle(options);
}

export default handleMessage;
