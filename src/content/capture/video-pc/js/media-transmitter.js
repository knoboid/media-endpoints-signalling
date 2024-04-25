import { createCallerConnection } from "./connections/caller-connection.js";
import NWCallerSignaller from "./signalling/network/caller-signaller.js";
import RespondersList from "./ui/responders-list.js";

// const wss = "wss://localhost:5501";
const wss = "wss://192.168.43.35:5501";
// const wss = "wss://192.168.0.72:5501";

let callerID;

const leftVideo = document.getElementById("leftVideo");
const respondersList = document.querySelector("#responders");
const respondersComponent = new RespondersList(respondersList);
const nWCallerSignaller = new NWCallerSignaller(wss);

nWCallerSignaller.addEventListener("onGotCallerID", (e) => {
  callerID = e.data;
});

respondersComponent.render([]);

nWCallerSignaller.addEventListener("onUpdateResponders", (event) => {
  const otherResponders = event.data.filter(
    // (responder) => Number(responder.id) !== responderID
    (responder) => Number(responder.id) !== -1
  );
  respondersComponent.render(otherResponders);
});

export function setupTransmitter(stream) {
  leftVideo.srcObject = stream;
  const name = "p1";
  let pc;

  respondersComponent.addEventListener("call", (e) => {
    console.log("call pressed");
    console.log(e.data);
    nWCallerSignaller.send({
      type: "initiateCall",
      payload: { responderID: e.data },
    });
  });

  respondersComponent.addEventListener("hangup", (e) => {
    console.log("hangup pressed");
    pc.close();
    nWCallerSignaller.send({
      type: "terminated",
    });
  });

  nWCallerSignaller.addEventListener("initiateCallSuccess", (event) => {
    console.log("get initiateCallSuccess");
    console.log(event.data);
    call();
  });

  const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1,
  };

  leftVideo.play();

  function call() {
    console.log("Starting call");
    const servers = null;
    pc = createCallerConnection(servers, name, stream, nWCallerSignaller);
  }
}
