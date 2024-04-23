import Peer from "./peer.js";
import PeerRegistry from "./peer-registrty.js";
import ConnectionRegistry from "./connection-registry.js";
import { createCallerConnection } from "./connections/caller-connection.js";
import { createResponderConnection } from "./connections/responder-connection.js";
import SignallingChannel from "./signalling/signalling-channel.js";

const leftVideo = document.getElementById("leftVideo");
const rightVideo = document.getElementById("rightVideo");

export function peerConnect(stream) {
  console.log("success");
  leftVideo.srcObject = stream;

  const p1 = "p1";
  const p2 = "p2";

  const signallingChannel = new SignallingChannel();

  const peers = new PeerRegistry();
  peers.addPeer(new Peer(p1));
  peers.addPeer(new Peer(p2));
  const connections = new ConnectionRegistry(peers);
  connections.connect(p1, p2);

  let pc1, caller;
  let pc2, responder;
  const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 1,
  };

  let startTime;

  // Video tag capture must be set up after video tracks are enumerated.
  leftVideo.oncanplay = call;
  if (leftVideo.readyState >= 3) {
    // HAVE_FUTURE_DATA
    // Video is already ready to play, call maybeCreateStream in case oncanplay
    // fired before we registered the event handler.
    call();
  }

  leftVideo.play();

  rightVideo.onloadedmetadata = () => {
    console.log(
      `Remote video videoWidth: ${rightVideo.videoWidth}px,  videoHeight: ${rightVideo.videoHeight}px`
    );
  };

  rightVideo.onresize = () => {
    console.log(
      `Remote video size changed to ${rightVideo.videoWidth}x${rightVideo.videoHeight}`
    );
    // We'll use the first onresize callback as an indication that
    // video has started playing out.
    if (startTime) {
      const elapsedTime = window.performance.now() - startTime;
      console.log("Setup time: " + elapsedTime.toFixed(3) + "ms");
      startTime = null;
    }
  };

  function call() {
    console.log("Starting call");
    startTime = window.performance.now();
    const videoTracks = stream.getVideoTracks();
    const audioTracks = stream.getAudioTracks();
    if (videoTracks.length > 0) {
      console.log(`Using video device: ${videoTracks[0].label}`);
    }
    if (audioTracks.length > 0) {
      console.log(`Using audio device: ${audioTracks[0].label}`);
    }
    const servers = null;

    caller = createCallerConnection(servers, p1, stream, signallingChannel);
    pc1 = caller;
    peers.setConnection(p1, pc1);
    console.log("Created local peer connection object pc1");

    responder = createResponderConnection(servers, p2, signallingChannel);
    pc2 = responder;
    peers.setConnection(p2, pc2);
    console.log("Created remote peer connection object pc2");

    console.log("pc1 createOffer start");
    pc1.createOffer(
      onCreateOfferSuccess,
      onCreateSessionDescriptionError,
      offerOptions
    );
  }

  function onCreateSessionDescriptionError(error) {
    console.log(`Failed to create session description: ${error.toString()}`);
  }

  function onCreateOfferSuccess(desc) {
    console.log(`Offer from pc1 ${desc.sdp}`);
    console.log("pc1 setLocalDescription start");
    pc1.setLocalDescription(
      desc,
      () => onSetLocalSuccess(pc1),
      onSetSessionDescriptionError
    );
    console.log("pc2 setRemoteDescription start");
    pc2.setRemoteDescription(
      desc,
      () => onSetRemoteSuccess(pc2),
      onSetSessionDescriptionError
    );
    console.log("pc2 createAnswer start");
    // Since the 'remote' side has no media stream we need
    // to pass in the right constraints in order for it to
    // accept the incoming offer of audio and video.
    pc2.createAnswer(onCreateAnswerSuccess, onCreateSessionDescriptionError);
  }

  function onSetLocalSuccess(pc) {
    console.log(`${getName(pc)} setLocalDescription complete`);
  }

  function onSetRemoteSuccess(pc) {
    console.log(`${getName(pc)} setRemoteDescription complete`);
  }

  function onSetSessionDescriptionError(error) {
    console.log(`Failed to set session description: ${error.toString()}`);
  }

  function onCreateAnswerSuccess(desc) {
    console.log(`Answer from pc2: ${desc.sdp}`);
    console.log("pc2 setLocalDescription start");
    pc2.setLocalDescription(
      desc,
      () => onSetLocalSuccess(pc2),
      onSetSessionDescriptionError
    );
    console.log("pc1 setRemoteDescription start");
    pc1.setRemoteDescription(
      desc,
      () => onSetRemoteSuccess(pc1),
      onSetSessionDescriptionError
    );
  }

  function getName(pc) {
    return pc === pc1 ? "pc1" : "pc2";
  }
}
