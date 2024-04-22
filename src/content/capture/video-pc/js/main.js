/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
import { peerConnect } from "./peer-connect.js";

const leftVideo = document.getElementById("leftVideo");
const rightVideo = document.getElementById("rightVideo");

const constraints = {
  audio: true,
  video: true,
};

function handleError(error) {
  throw new Error(error);
}

navigator.mediaDevices
  .getUserMedia(constraints)
  .then(peerConnect)
  .catch(handleError);
