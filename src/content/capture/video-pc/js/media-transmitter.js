import { createTransmitterConnection } from "./connections/transmitter-connection.js";
import NWTransmitterSignaller from "./signalling/network/transmitter-signaller.js";
import RecieversList from "./ui/recievers-list.js";

let transmitterID;

const leftVideo = document.getElementById("leftVideo");
const recieversList = document.querySelector("#recievers");
const recieversComponent = new RecieversList(recieversList);

recieversComponent.render([]);

export function setupTransmitter(servers, wss, stream) {
  leftVideo.srcObject = stream;
  const name = "p1";
  let pc;

  const nWTransmitterSignaller = new NWTransmitterSignaller(wss);

  nWTransmitterSignaller.addEventListener("onGotTransmitterID", (e) => {
    transmitterID = e.data;
  });

  nWTransmitterSignaller.addEventListener("onUpdateRecievers", (event) => {
    const otherRecievers = event.data.filter(
      // (reciever) => Number(reciever.id) !== recieverID
      (reciever) => Number(reciever.id) !== -1
    );
    recieversComponent.render(otherRecievers);
  });

  recieversComponent.addEventListener("call", (e) => {
    console.log("call pressed");
    console.log(e.data);
    nWTransmitterSignaller.send({
      type: "initiateCall",
      payload: { recieverID: e.data },
    });
  });

  recieversComponent.addEventListener("hangup", (e) => {
    console.log("hangup pressed");
    pc.close();
    nWTransmitterSignaller.send({
      type: "terminated",
    });
  });

  nWTransmitterSignaller.addEventListener("initiateCallSuccess", (event) => {
    console.log("get initiateCallSuccess");
    console.log(event.data);
    call();
  });

  nWTransmitterSignaller.addEventListener("terminated", (event) => {
    pc.close();
  });

  const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1,
  };

  leftVideo.play();

  function call() {
    console.log("Starting call");
    pc = createTransmitterConnection(
      servers,
      name,
      stream,
      nWTransmitterSignaller
    );
  }
}
