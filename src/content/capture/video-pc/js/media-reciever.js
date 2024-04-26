import { createResponderConnection } from "./connections/responder-connection.js";
import NWResponderSignaller from "./signalling/network/responder-signaller.js";

console.log("Importing media-reciever");

let responderID;
const rightVideo = document.getElementById("rightVideo");
const responderIDElement = document.querySelector("#responder-id");
const recieverHangup = document.querySelector("#reciever-hangup");

export function setupReciever(servers, wss) {
  const p2 = "p2";
  let pc;

  const nWResponderSignaller = new NWResponderSignaller(wss);

  nWResponderSignaller.addEventListener("onGotResponderID", (e) => {
    responderID = e.data;
    responderIDElement.innerHTML = responderID;
  });

  recieverHangup.onclick = () => {
    console.log("R HANG");
    pc.close();
    nWResponderSignaller.send({
      type: "terminated",
    });
  };

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

  rightVideo.onloadedmetadata = () => {
    console.log(
      `Remote video videoWidth: ${rightVideo.videoWidth}px,  videoHeight: ${rightVideo.videoHeight}px`
    );
  };

  function recieve() {
    console.log("Recieve");
    pc = createResponderConnection(servers, p2, nWResponderSignaller);
  }
}
