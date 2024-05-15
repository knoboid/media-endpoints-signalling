import receiverMesssageHandlers from "./receiver-message-handlers.js";
import transmitterMesssageHandlers from "./transmitter-message-handlers.js";

const handlerMap = {
  reciever: receiverMesssageHandlers,
  transmitter: transmitterMesssageHandlers,
};

function messageHandlers(options) {
  if (options.clientType in handlerMap) {
    const handler = handlerMap[options.clientType];
    handler(options);
  } else {
    console.log(`Unhandled clientType ${options.clientType}`);
  }
}

export default messageHandlers;
