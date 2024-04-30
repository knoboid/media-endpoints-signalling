import { createTransmitterConnection } from "./connections/transmitter-connection.js";
import { createRecieverConnection } from "./connections/reciever-connection.js";
import NWTransmitterSignaller from "./signalling/network/transmitter-signaller.js";
import NWRecieverSignaller from "./signalling/network/reciever-signaller.js";
import RecieversList from "./ui/recievers-list.js";

// const wss = "wss://localhost:5501";
const wss = "wss://192.168.43.35:5501";
// const wss = "wss://192.168.0.72:5501";

let transmitterID, recieverID;

const leftVideo = document.getElementById("leftVideo");
const rightVideo = document.getElementById("rightVideo");

const transmittersList = document.querySelector("#transmitters");
const recieversList = document.querySelector("#recievers");

const recieverIDElement = document.querySelector("#reciever-id");

const recieversComponent = new RecieversList(recieversList);

const nWTransmitterSignaller = new NWTransmitterSignaller(wss);
const nWRecieverSignaller = new NWRecieverSignaller(wss);

nWTransmitterSignaller.addEventListener("onGotTransmitterID", (e) => {
  transmitterID = e.data;
});

nWRecieverSignaller.addEventListener("onGotRecieverID", (e) => {
  recieverID = e.data;
  recieverIDElement.innerHTML = recieverID;
});

recieversComponent.render([]);

nWTransmitterSignaller.addEventListener("onUpdateRecievers", (event) => {
  const otherRecievers = event.data.filter(
    (reciever) => Number(reciever.id) !== recieverID
  );
  recieversComponent.render(otherRecievers);
});

export function peerConnect(stream) {
  console.log("success");
  leftVideo.srcObject = stream;

  const p1 = "p1";
  const p2 = "p2";

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
  });

  nWRecieverSignaller.addEventListener("initiateResponse", () => {
    recieve();
  });

  nWTransmitterSignaller.addEventListener("initiateCallSuccess", (event) => {
    console.log("get initiateCallSuccess");
    console.log(event.data);
    call();
  });

  let pc1, transmitter;
  let pc2, reciever;
  const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1,
  };

  let startTime;

  leftVideo.oncanplay = () => {
    console.log("left vid - on can play triggered");
    //call()
  };
  if (leftVideo.readyState >= 3) {
    console.log("left vid - readyState >= 3");
    // call();
  }

  leftVideo.play();

  rightVideo.onloadedmetadata = () => {
    console.log(
      `Remote video videoWidth: ${rightVideo.videoWidth}px,  videoHeight: ${rightVideo.videoHeight}px`
    );
  };

  function call() {
    console.log("Starting call");
    // startTime = window.performance.now();
    // const videoTracks = stream.getVideoTracks();
    // const audioTracks = stream.getAudioTracks();
    // if (videoTracks.length > 0) {
    //   console.log(`Using video device: ${videoTracks[0].label}`);
    // }
    // if (audioTracks.length > 0) {
    //   console.log(`Using audio device: ${audioTracks[0].label}`);
    // }
    const servers = null;

    transmitter = createTransmitterConnection(
      servers,
      p1,
      stream,
      nWTransmitterSignaller
    );
    pc1 = transmitter;
    peers.setConnection(p1, pc1);
    console.log("Created local peer connection object pc1");
  }

  function recieve() {
    const servers = null;
    reciever = createRecieverConnection(servers, p2, nWRecieverSignaller);
    pc2 = reciever;
    peers.setConnection(p2, pc2);
    console.log("Created remote peer connection object pc2");
  }
}
