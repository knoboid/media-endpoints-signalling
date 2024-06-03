export function broadcastToClientGroup(clientGroup, type, payload) {
  clientGroup.getWebSockets().forEach((webSocket) => {
    webSocket.send(JSON.stringify({ type, payload }));
  });
}
