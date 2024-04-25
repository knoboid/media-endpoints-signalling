import { createResponderConnection } from "./connections/responder-connection.js";
import NWResponderSignaller from "./signalling/network/responder-signaller.js";

// const wss = "wss://localhost:5501";
const wss = "wss://192.168.43.35:5501";
// const wss = "wss://192.168.0.72:5501";

console.log("Importing media-reciever");

let responderID;
const rightVideo = document.getElementById("rightVideo");
const callersList = document.querySelector("#callers");
const responderIDElement = document.querySelector("#responder-id");
const recieverHangup = document.querySelector("#reciever-hangup");
const nWResponderSignaller = new NWResponderSignaller(wss);

nWResponderSignaller.addEventListener("onGotResponderID", (e) => {
  responderID = e.data;
  responderIDElement.innerHTML = responderID;
});

export function setupReciever() {
  const p2 = "p2";
  let pc;

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
    const servers = null;
    pc = createResponderConnection(servers, p2, nWResponderSignaller);
  }
}
