function transmitterMesssageHandlers({
  webSocket,
  clientId,
  clientGroups,
  messageCounter,
  clientType,
  type,
  payload,
  message,
}) {
  console.log("In transmitterMesssageHandlers");
  console.log(messageCounter, clientType, type, payload);
}

export default transmitterMesssageHandlers;
