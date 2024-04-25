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

function handleError(error) {
  throw new Error(error);
}

function setup(stream) {
  setupTransmitter(stream);
  setupReciever();
}

navigator.mediaDevices.getUserMedia(constraints).then(setup).catch(handleError);
