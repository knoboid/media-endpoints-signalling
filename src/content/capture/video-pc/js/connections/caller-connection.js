export function createCallerConnection(
  servers,
  name,
  stream,
  signallingChannel,
  offerOptions
) {
  const cc = new RTCPeerConnection(servers);

  cc.oniceconnectionstatechange = (e) => onIceStateChange(cc, e);
  cc.onicecandidate = (e) => onIceCandidate(e);

  function onIceStateChange(pc, event) {
    if (pc) {
      console.log(`${name} ICE state: ${pc.iceConnectionState}`);
      console.log("ICE state change event: ", event);
    }
  }

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
      () => onSetLocalSuccess(),
      onSetSessionDescriptionError
    );
    console.log("signal onCallerDescription");
    signal("onCallerDescription", desc);
  }

  function onSetSessionDescriptionError(error) {
    console.log(`Failed to set session description: ${error.toString()}`);
  }

  function onCreateSessionDescriptionError(error) {
    console.log(`Failed to create session description: ${error.toString()}`);
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
          () => onAddIceCandidateSuccess(),
          (err) => onAddIceCandidateError(err)
        );
        console.log(`${name} ICE candidate: 
        ${candidate ? candidate.candidate : "(null)"}`);
        break;
      case "onRespondererDescription":
        const desc = payload;
        cc.setRemoteDescription(
          desc,
          () => onSetRemoteSuccess(),
          onSetSessionDescriptionError
        );
        break;

      default:
        break;
    }
  });

  function onSetLocalSuccess() {
    console.log(`${name} setLocalDescription complete`);
  }

  function onSetRemoteSuccess() {
    console.log(`${name} setRemoteDescription complete`);
  }

  function onAddIceCandidateSuccess() {
    console.log(`${name} addIceCandidate success`);
  }

  function onAddIceCandidateError(error) {
    console.log(`${name} failed to add ICE Candidate: ${error.toString()}`);
  }

  return cc;
}
