import { log } from "./util.js";

export function onSetLocalSuccess(name) {
  log(`${name} setLocalDescription complete`);
}

export function onSetRemoteSuccess(name) {
  log(`${name} setRemoteDescription complete`);
}

export function onAddIceCandidateSuccess(name) {
  log(`${name} addIceCandidate success`);
}

export function onAddIceCandidateError(name, error) {
  log(`${name} failed to add ICE Candidate: ${error.toString()}`);
}

export function onSetSessionDescriptionError(error) {
  log(`Failed to set session description: ${error.toString()}`);
}

export function onCreateSessionDescriptionError(error) {
  log(`Failed to create session description: ${error.toString()}`);
}

export function onIceStateChange(pc, name, event) {
  if (pc) {
    log(`${name} ICE state: ${pc.iceConnectionState}`);
    log("ICE state change event: ", event);
  }
}
