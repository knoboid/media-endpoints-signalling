function receiverMesssageHandlers({
  messageCounter,
  clientType,
  type,
  payload,
}) {
  console.log("In receiverMesssageHandlers");
  console.log(messageCounter, clientType, type, payload);
}

export default receiverMesssageHandlers;
