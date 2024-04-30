import { createCallerConnection } from "./connections/caller-connection.js";
import NWCallerSignaller from "./signalling/network/caller-signaller.js";
import RecieversList from "./ui/recievers-list.js";

let callerID;

const leftVideo = document.getElementById("leftVideo");
const recieversList = document.querySelector("#recievers");
const recieversComponent = new RecieversList(recieversList);

recieversComponent.render([]);

export function setupTransmitter(servers, wss, stream) {
  leftVideo.srcObject = stream;
  const name = "p1";
  let pc;

  const nWCallerSignaller = new NWCallerSignaller(wss);

  nWCallerSignaller.addEventListener("onGotCallerID", (e) => {
    callerID = e.data;
  });

  nWCallerSignaller.addEventListener("onUpdateRecievers", (event) => {
    const otherRecievers = event.data.filter(
      // (reciever) => Number(reciever.id) !== recieverID
      (reciever) => Number(reciever.id) !== -1
    );
    recieversComponent.render(otherRecievers);
  });

  recieversComponent.addEventListener("call", (e) => {
    console.log("call pressed");
    console.log(e.data);
    nWCallerSignaller.send({
      type: "initiateCall",
      payload: { recieverID: e.data },
    });
  });

  recieversComponent.addEventListener("hangup", (e) => {
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

  nWCallerSignaller.addEventListener("terminated", (event) => {
    pc.close();
  });

  const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1,
  };

  leftVideo.play();

  function call() {
    console.log("Starting call");
    pc = createCallerConnection(servers, name, stream, nWCallerSignaller);
  }
}
