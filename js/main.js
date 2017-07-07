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
