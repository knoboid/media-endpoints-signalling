import receiverMesssageHandlers from "./receiver-message-handlers.js";
import transmitterMesssageHandlers from "./transmitter-message-handlers.js";

const handlerMap = {
  reciever: receiverMesssageHandlers,
  transmitter: transmitterMesssageHandlers,
};

function messageHandlers({ messageCounter, clientType, type, payload }) {
  if (clientType in handlerMap) {
    const handler = handlerMap[clientType];
    handler({ messageCounter, clientType, type, payload });
  } else {
    console.log(`Unhandled clientType ${clientType}`);
  }
}

export default messageHandlers;
