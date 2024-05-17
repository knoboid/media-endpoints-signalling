import { createReceiverConnection } from "./peer-connection/receiver-connection.js";
import { createReceiverWSSignaller } from "./ws/create-ws-signallers.js";
import PayloadEvent from "./misc/payload-event.js";

class Receiver extends EventTarget {
  constructor(servers, videoElement, code, onready, onhangup) {
    super();
    this.servers = servers;
    this.onhangup = onhangup;
    const p2 = "p2";
    this.pc;

    this.nWReceiverSignaller = createReceiverWSSignaller(code);

    this.nWReceiverSignaller.addEventListener("receiverRegistered", (e) => {
      this.receiverID = e.data;
      // setReceiverID(receiverID);
      onready(this.receiverID);
    });

    this.nWReceiverSignaller.addEventListener("newConnectionRequest", () => {
      this.receive(videoElement);
    });

    this.nWReceiverSignaller.addEventListener("terminated", (e) => {
      this.pc.close();
    });

    const offerOptions = {
      offerToReceiveAudio: 1,
      offerToReceiveVideo: 1,
    };
  }

  hangup() {
    if (!this.pc) return;
    this.logConnectionState();
    this.pc.close();
    this.nWReceiverSignaller.send({
      type: "terminated",
    });
  }

  logConnectionState() {
    if (this.pc) {
      console.log(`Receiver ${this.receiverID}: ${this.pc.connectionState}`);
    } else {
      console.log("There is no peerConnection object defined.");
    }
  }

  receive(videoElement) {
    this.pc = createReceiverConnection(
      this.servers,
      this.p2,
      this.nWReceiverSignaller,
      videoElement
    );
  }
}

export default Receiver;
