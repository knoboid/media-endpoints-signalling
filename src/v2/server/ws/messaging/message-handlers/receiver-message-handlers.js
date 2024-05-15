function receiverMesssageHandlers({
  webSocket,
  clientId,
  clientGroups,
  messageCounter,
  clientType,
  type,
  payload,
  message,
}) {
  console.log("In receiverMesssageHandlers");
  console.log(messageCounter, clientType, type, payload);
  const receivers = clientGroups.receivers;
  if (messageCounter === 0) {
    receivers.addClient(clientId, webSocket, "available");
    webSocket.send(JSON.stringify({ type: "recieverRegistered" }));
  } else {
  }
}

export default receiverMesssageHandlers;
