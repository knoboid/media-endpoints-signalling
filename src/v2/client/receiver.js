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
      const receiverID = e.data;
      // setReceiverID(receiverID);
      onready(receiverID);
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
    this.pc.close();
    this.nWReceiverSignaller.send({
      type: "terminated",
    });
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
