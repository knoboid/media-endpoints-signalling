import {
  onSetLocalSuccess,
  onSetRemoteSuccess,
  onAddIceCandidateSuccess,
  onAddIceCandidateError,
  onSetSessionDescriptionError,
  onCreateSessionDescriptionError,
  onIceStateChange,
} from "./callbacks.js";

export function createCallerConnection(
  servers,
  name,
  stream,
  signallingChannel,
  offerOptions
) {
  const cc = new RTCPeerConnection(servers);

  cc.oniceconnectionstatechange = (e) => onIceStateChange(cc, name, e);
  cc.onicecandidate = (e) => onIceCandidate(e);

  stream.getTracks().forEach((track) => cc.addTrack(track, stream));

  console.log("caller createOffer start");
  cc.createOffer(
    onCreateOfferSuccess,
    onCreateSessionDescriptionError,
    offerOptions
  );

  function onCreateOfferSuccess(desc) {
    console.log(`Offer from caller ${desc.sdp}`);
    console.log("caller setLocalDescription start");
    cc.setLocalDescription(
      desc,
      () => onSetLocalSuccess(name),
      onSetSessionDescriptionError
    );
    console.log("signal onCallerDescription");
    signal("onCallerDescription", desc);
  }

  function onIceCandidate(event) {
    signal("onIceCandidate", event.candidate);
  }

  function signal(type, payload) {
    signallingChannel.caller(JSON.stringify({ type, payload }));
  }

  signallingChannel.addEventListener("fromResponder", (event) => {
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
      case "onRespondererDescription":
        const desc = payload;
        cc.setRemoteDescription(
          desc,
          () => onSetRemoteSuccess(name),
          onSetSessionDescriptionError
        );
        break;

      default:
        break;
    }
  });

  return cc;
}
