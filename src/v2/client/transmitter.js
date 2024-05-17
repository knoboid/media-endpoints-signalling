import { createTransmitterConnection } from "./peer-connection/transmitter-connection.js";
import { createTransmitterWSSignaller } from "./ws/create-ws-signallers.js";
import PayloadEvent from "./misc/payload-event.js";

class Transmitter extends EventTarget {
  constructor(servers, stream, code, onready) {
    super();
    this.servers = servers;
    this.stream = stream;
    this.name = "p1";
    this.pc = null;

    this.nWTransmitterSignaller = createTransmitterWSSignaller(code);

    this.nWTransmitterSignaller.addEventListener("onGotTransmitterID", (e) => {
      this.transmitterID = e.data;
      this.dispatchEvent(
        new PayloadEvent("onGotTransmitterID", this.transmitterID)
      );
      if (onready) {
        onready(this.transmitterID);
      }
    });

    this.nWTransmitterSignaller.addEventListener(
      "initiateCallSuccess",
      (event) => {
        console.log("get initiateCallSuccess");
        console.log(event.data);
        this.call();
      }
    );

    this.nWTransmitterSignaller.addEventListener("terminated", (event) => {
      this.pc.close();
    });

    const offerOptions = {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1,
    };
  }

  attachStream(stream) {
    this.stream = stream;
  }

  initiateCall(receiverID) {
    console.log(
      `Attempting to initite call from ${this.transmitterID} to {recieverID}`
    );
    this.logConnectionState();
    this.nWTransmitterSignaller.send({
      type: "initiateCall",
      payload: { receiverID },
    });
  }

  logConnectionState() {
    if (this.pc) {
      console.log(
        `Transmitter ${this.transmitterID}: ${this.pc.connectionState}`
      );
    } else {
      console.log("There is no peerConnection object defined.");
    }
  }

  hangup() {
    if (!this.pc) return;
    this.logConnectionState();
    this.pc.close();
    this.nWTransmitterSignaller.send({
      type: "terminated",
    });
  }

  call() {
    this.pc = createTransmitterConnection(
      this.servers,
      this.name,
      this.stream,
      this.nWTransmitterSignaller
    );
  }
}

export default Transmitter;
