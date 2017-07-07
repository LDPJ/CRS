'use strict';

// getUserMedia API is called. 

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// The constraints arguments specifies what media to get. 

var constraints = {
  audio: false,
  video: true
};

// The video stream from the webcam is set as the source of the video element. 

var video = document.querySelector('video');

// The stream object passed to getUserMedia() is in global scope, so you can inspect from the browser console.

function successCallback(stream) {
  window.stream = stream; // stream available to console
  if (window.URL) {
    video.src = window.URL.createObjectURL(stream);
  } else {
    video.src = stream;
  }
}

function errorCallback(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.getUserMedia(constraints, successCallback, errorCallback);

// create an RTCPeerConnection object with an onicecandidate handler.

pc1 = new RTCPeerConnection(servers);
trace('Created local peer connection object pc1');
pc1.onicecandidate = function(e) {
  onIceCandidate(pc1, e);
};

// call getUserMedia() and add the stream passed to that:

pc1.addStream(localStream);

// call addIceCAndidate(), to add the candidate to the remote peer description:

function onIceCandidate(pc, event) {
  if (event.candidate) {
    getOtherPc(pc).addIceCandidate(
      new RTCIceCandidate(event.candidate)
    ).then(
      function() {
        onAddIceCandidateSuccess(pc);
      },
      function(err) {
        onAddIceCandidateError(pc, err);
      }
    );
    trace(getName(pc) + ' ICE candidate: \n' + event.candidate.candidate);
  }
}

// WebRTC peers need to find out and exchange local and remote audio and video media information, 
// such as resolution and codec capabilities.
// Signaling to exchange media configuration information proceeds by exchanging offer and answer metadata, 
// using the Session Description Protocol format, SDP.

// Run the RTCPEerConnection createOffer()method.  The promise returned provides an RTCSession Description.  
// 1st Peer Local session description:

pc1.createOffer(
    offerOptions
  ).then(
    onCreateOfferSuccess,
    onCreateSessionDescriptionError
  );

//  If successful, the first peer sets the local description using setLocalDescription() and then sends the session description to 
//  the second peer via their signaling channel.

function onCreateOfferSuccess(desc) {
  pc1.setLocalDescription(desc).then(
    function() {
      onSetLocalSuccess(pc1);
    },
    onSetSessionDescriptionError
  );
  pc2.setRemoteDescription(desc).then(
    function() {
      onSetRemoteSuccess(pc2);
    },
    onSetSessionDescriptionError
  );
  // Since the 'remote' side has no media stream we need
  // to pass in the right constraints in order for it to
  // accept the incoming offer of audio and video.
  pc2.createAnswer().then(
    onCreateAnswerSuccess,
    onCreateSessionDescriptionError
  );
}

function onCreateAnswerSuccess(desc) {
  pc2.setLocalDescription(desc).then(
    function() {
      onSetLocalSuccess(pc2);
    },
    onSetSessionDescriptionError
  );
  pc1.setRemoteDescription(desc).then(
    function() {
      onSetRemoteSuccess(pc1);
    },
    onSetSessionDescriptionError
  );
}

// Style the page with CSS.  Make sure the layout works on mobile.  
// Use the Dev Tools console to analyze the localStream, pc1, and pc2.
// From the console, look at pcl.localDescription.  What does SDP format look like?
