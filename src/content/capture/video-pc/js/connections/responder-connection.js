import {
  onSetLocalSuccess,
  onSetRemoteSuccess,
  onAddIceCandidateSuccess,
  onAddIceCandidateError,
  onSetSessionDescriptionError,
  onCreateSessionDescriptionError,
  onIceStateChange,
} from "./callbacks.js";

export function createResponderConnection(servers, name, signallingChannel) {
  const cc = new RTCPeerConnection(servers);

  cc.oniceconnectionstatechange = (e) => onIceStateChange(cc, name, e);
  cc.onicecandidate = (e) => onIceCandidate(e);
  cc.ontrack = (e) => {
    if (rightVideo.srcObject !== e.streams[0]) {
      rightVideo.srcObject = e.streams[0];
      console.log("responder received caller stream", event);
    }
  };

  function onIceCandidate(event) {
    signallingChannel.responder(
      JSON.stringify({ type: "onIceCandidate", payload: event.candidate })
    );
  }

  signallingChannel.addEventListener("fromCaller", (event) => {
    const { type, payload } = JSON.parse(event.data);
    switch (type) {
      case "onIceCandidate":
        const candidate = payload;
        cc.addIceCandidate(candidate).then(
          () => onAddIceCandidateSuccess(name),
          (err) => onAddIceCandidateError(name, err)
        );
        console.log(`${name} ICE candidate: 
        ${candidate ? candidate.candidate : "(null)"}`);
        break;

      case "onCallerDescription":
        const desc = payload;
        cc.setRemoteDescription(
          desc,
          () => onSetRemoteSuccess(name),
          onSetSessionDescriptionError
        );
        cc.createAnswer(onCreateAnswerSuccess, onCreateSessionDescriptionError);
        break;

      default:
        break;
    }
  });

  function onCreateAnswerSuccess(desc) {
    console.log(`Answer from responder: ${desc.sdp}`);
    console.log("responder setLocalDescription start");
    cc.setLocalDescription(
      desc,
      () => onSetLocalSuccess(name),
      onSetSessionDescriptionError
    );
    console.log("signalling onRespondererDescription");
    signal("onRespondererDescription", desc);
  }

  function signal(type, payload) {
    signallingChannel.responder(JSON.stringify({ type, payload }));
  }

  return cc;
}
