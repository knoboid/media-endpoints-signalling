import { createTransmitterConnection } from "./connections/transmitter-connection.js";
import { createTransmitterWSSignaller } from "./signalling/network/create-ws-signallers.js";

let transmitterID;

// const leftVideo = document.getElementById("leftVideo");

export function setupTransmitter(servers, stream, ui, code) {

  class TransmitterController {
    constructor(signaller, videoElement) {
      this.signaller = signaller
      this.videoElement = videoElement
    }

    hangup() {
      console.log("TransmitterController hangup pressed");
      console.log("doing tc hangup");
      console.log(this.pc);
      this.pc.close();
      this.signaller.send({
        type: "terminated",
      });
      this.videoElement.srcObject = null;
    }

    call() {
      console.log("Starting call");
      this.pc = createTransmitterConnection(
        servers,
        name,
        stream,
        this.signaller
      );
      console.log("trancontroller call");
      console.log(this.pc);
      // this.pc = pc
    }
  }


  const leftVideo = ui.resolve("addVideo");

  console.log(leftVideo);

  return doit();

  // leftVideo.oncanplay = () => {
  //   console.log("I can play");
  // };

  function doit() {
    const rlist = document.querySelector("#rlist");

    rlist.setData([]);

    leftVideo.srcObject = stream;
    const name = "p1";
    // let pc;

    const nWTransmitterSignaller = createTransmitterWSSignaller(code);

    const tc = new TransmitterController(nWTransmitterSignaller, leftVideo);

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
        tc.hangup();
        // console.log("hangup pressed");
        // tc.pc.close();
        // nWTransmitterSignaller.send({
        //   type: "terminated",
        // });
      },
      { capture: true }
    );

    nWTransmitterSignaller.addEventListener("initiateCallSuccess", (event) => {
      console.log("get initiateCallSuccess");
      console.log(event.data);
      tc.call();
      // call();
    });

    nWTransmitterSignaller.addEventListener("terminated", (event) => {
      tc.pc.close();
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

    console.log("MT returning tc");
    console.log(tc);

    return tc;

  }
}
