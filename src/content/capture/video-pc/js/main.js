/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
import { setupTransmitter } from "./media-transmitter.js";
import { setupReciever } from "./media-reciever.js";

const constraints = {
  audio: true,
  video: true,
};

// const wss = "wss://localhost:5501";
const wss = "wss://192.168.43.35:5502";
// const wss = "wss://192.168.0.72:5502";
// const wss = "wss://192.168.0.72:5501";
const servers = null;

function handleError(error) {
  setupReciever(servers, wss);
}

function setup(stream) {
  setupTransmitter(servers, wss, stream);
  setupReciever(servers, wss);
}

navigator.mediaDevices.getUserMedia(constraints).then(setup).catch(handleError);
