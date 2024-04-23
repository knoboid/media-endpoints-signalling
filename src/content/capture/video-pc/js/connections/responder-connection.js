export function createResponderConnection(servers, name, signallingChannel) {
  const cc = new RTCPeerConnection(servers);

  cc.oniceconnectionstatechange = (e) => onIceStateChange(cc, e);
  cc.onicecandidate = (e) => onIceCandidate(e);
  cc.ontrack = (e) => {
    if (rightVideo.srcObject !== e.streams[0]) {
      rightVideo.srcObject = e.streams[0];
      console.log("responder received caller stream", event);
    }
  };

  function onIceStateChange(pc, event) {
    if (pc) {
      console.log(`${name} ICE state: ${pc.iceConnectionState}`);
      console.log("ICE state change event: ", event);
    }
  }

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
          () => onAddIceCandidateSuccess(),
          (err) => onAddIceCandidateError(err)
        );
        console.log(`${name} ICE candidate: 
        ${candidate ? candidate.candidate : "(null)"}`);
        break;

      case "onCallerDescription":
        const desc = payload;
        cc.setRemoteDescription(
          desc,
          () => onSetRemoteSuccess(),
          onSetSessionDescriptionError
        );
        cc.createAnswer(onCreateAnswerSuccess, onCreateSessionDescriptionError);
        break;

      default:
        break;
    }
  });

  function onSetSessionDescriptionError(error) {
    console.log(`Failed to set session description: ${error.toString()}`);
  }

  function onCreateAnswerSuccess(desc) {
    console.log(`Answer from responder: ${desc.sdp}`);
    console.log("responder setLocalDescription start");
    cc.setLocalDescription(
      desc,
      () => onSetLocalSuccess(),
      onSetSessionDescriptionError
    );
    console.log("signalling onRespondererDescription");
    signal("onRespondererDescription", desc);
  }

  function onSetLocalSuccess() {
    console.log(`${name} setLocalDescription complete`);
  }

  function onSetRemoteSuccess() {
    console.log(`${name} setRemoteDescription complete`);
  }

  function onCreateSessionDescriptionError(error) {
    console.log(`Failed to create session description: ${error.toString()}`);
  }

  function onAddIceCandidateSuccess() {
    console.log(`${name} addIceCandidate success`);
  }

  function onAddIceCandidateError(error) {
    console.log(`${name} failed to add ICE Candidate: ${error.toString()}`);
  }

  function signal(type, payload) {
    signallingChannel.responder(JSON.stringify({ type, payload }));
  }

  return cc;
}
