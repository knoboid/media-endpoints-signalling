import { createRecieverConnection } from "./connections/reciever-connection.js";
import { createRecieverWSSignaller } from "./signalling/network/create-ws-signallers.js";
import {
  setRecieverID,
  recieverUIEvents,
  addRecieverElement,
} from "./ui/ui.js";

console.log("Importing media-reciever");

// v.play();

export function setupReciever(servers, htmlContainer) {
  const p2 = "p2";
  let pc;

  const nWRecieverSignaller = createRecieverWSSignaller();

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

  nWRecieverSignaller.addEventListener("newConnectionRequest", () => {
    const videoElement = null; //addRecieverElement();
    recieve(videoElement);
  });

  nWRecieverSignaller.addEventListener("terminated", (e) => {
    console.log("Reciever terminating");
    console.log(e);
    pc.close();
  });

  const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1,
  };

  function recieve(videoElement) {
    console.log("Recieve");
    pc = createRecieverConnection(
      servers,
      p2,
      nWRecieverSignaller,
      videoElement
    );
    return pc;
  }
}
