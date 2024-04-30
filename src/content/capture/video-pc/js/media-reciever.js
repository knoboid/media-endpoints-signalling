import { createRecieverConnection } from "./connections/reciever-connection.js";
import NWRecieverSignaller from "./signalling/network/reciever-signaller.js";
import { setRecieverID, recieverUIEvents } from "./ui/ui.js";

console.log("Importing media-reciever");

export function setupReciever(servers, wss) {
  const p2 = "p2";
  let pc;

  const nWRecieverSignaller = new NWRecieverSignaller(wss);

  nWRecieverSignaller.addEventListener("onGotRecieverID", (e) => {
    const recieverID = e.data;
    setRecieverID(recieverID);
  });

  recieverUIEvents.addEventListener("reciever-hangup", () => {
    pc.close();
    nWRecieverSignaller.send({
      type: "terminated",
    });
  });

  nWRecieverSignaller.addEventListener("initiateResponse", () => {
    recieve();
  });

  nWRecieverSignaller.addEventListener("terminated", () => {
    console.log("Reciever terminating");
    pc.close();
  });

  const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1,
  };

  function recieve() {
    console.log("Recieve");
    pc = createRecieverConnection(servers, p2, nWRecieverSignaller);
  }
}
