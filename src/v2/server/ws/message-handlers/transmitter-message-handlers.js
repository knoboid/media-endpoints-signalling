function transmitterMesssageHandlers({
  messageCounter,
  clientType,
  type,
  payload,
}) {
  console.log("In transmitterMesssageHandlers");
  console.log(messageCounter, clientType, type, payload);
}

export default transmitterMesssageHandlers;
