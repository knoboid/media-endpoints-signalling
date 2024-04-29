import { createResponderConnection } from "./connections/responder-connection.js";
import NWResponderSignaller from "./signalling/network/responder-signaller.js";
import { setRecieverID, recieverUIEvents } from "./ui/ui.js";

console.log("Importing media-reciever");

export function setupReciever(servers, wss) {
  const p2 = "p2";
  let pc;

  const nWResponderSignaller = new NWResponderSignaller(wss);

  nWResponderSignaller.addEventListener("onGotResponderID", (e) => {
    const recieverID = e.data;
    setRecieverID(recieverID);
  });

  recieverUIEvents.addEventListener("reciever-hangup", () => {
    pc.close();
    nWResponderSignaller.send({
      type: "terminated",
    });
  });

  nWResponderSignaller.addEventListener("initiateResponse", () => {
    recieve();
  });

  nWResponderSignaller.addEventListener("terminated", () => {
    console.log("Reciever terminating");
    pc.close();
  });

  const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1,
  };

  function recieve() {
    console.log("Recieve");
    pc = createResponderConnection(servers, p2, nWResponderSignaller);
  }
}
