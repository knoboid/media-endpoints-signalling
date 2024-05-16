/*
 *  Copyright (c) 2016 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
// import { setupTransmitter } from "./media-transmitter copy.js";
// import { setupReciever } from "./media-receiver.js";
import createUser from "./roles/user/create-user.js";
import registerWebComponents from "./ui/register-web-components.js";

registerWebComponents();

const receiversContainder = document.querySelector("#receivers-container");

const constraints = {
  audio: true,
  video: true,
};

const servers = null;

// function main() {
//   function setup(stream) {
//     setupTransmitter(servers, stream);
//     setupReciever(servers, receiversContainder);
//   }
//   navigator.mediaDevices.getUserMedia(constraints).then(setup); //.catch(handleError);
// }

function main() {
  createUser(servers, constraints);
}

main();
