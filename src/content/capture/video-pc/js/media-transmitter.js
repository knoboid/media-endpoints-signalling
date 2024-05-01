import { createTransmitterConnection } from "./connections/transmitter-connection.js";
import NWTransmitterSignaller from "./signalling/network/transmitter-signaller.js";

let transmitterID;

const leftVideo = document.getElementById("leftVideo");

export function setupTransmitter(servers, wss, stream) {
  const rlist = document.querySelector("#rlist");

  rlist.setData([]);

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
    rlist.setData(otherRecievers);
  });

  rlist.addEventListener(
    "call",
    (e) => {
      console.log("call pressed");
      console.log(e.data);
      nWTransmitterSignaller.send({
        type: "initiateCall",
        payload: { recieverID: e.data },
      });
    },
    { capture: true }
  );

  rlist.addEventListener(
    "hangup",
    (e) => {
      console.log("hangup pressed");
      pc.close();
      nWTransmitterSignaller.send({
        type: "terminated",
      });
    },
    { capture: true }
  );

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
