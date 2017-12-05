window.onload = function() {

  // Normalize the various vendor prefixed versions of getUserMedia.
  navigator.getUserMedia = (navigator.getUserMedia ||
                            navigator.webkitGetUserMedia ||
                            navigator.mozGetUserMedia || 
                            navigator.msGetUserMedia);

    // Check that the browser supports getUserMedia.
// If it doesn't show an alert, otherwise continue.
if (navigator.getUserMedia) {
  // Request the camera.
  navigator.getUserMedia(
    // Constraints
    {
      video: true
    },

    // Success Callback
    function(localMediaStream) {
        // Get a reference to the video element on the page.
        var vid = document.getElementById('camera-stream');
        
        var videoTracks = localMediaStream.getVideoTracks();
          //console.log('Got stream with constraints:', constraints);
          //console.log('Using video device: ' + videoTracks[0].label);
          stream.oninactive = function() {
            console.log('Stream inactive');
          };
          window.stream = localMediaStream; // make variable available to browser console
          vid.srcObject = localMediaStream;
        
        /*

        // Create an object URL for the video stream and use this 
        // to set the video source.
        var binaryData = [];
        binaryData.push(localMediaStream);
        var blob = new Blob(binaryData, {type: "application/zip"});
        vid.src = window.URL.createObjectURL(blob);//localMediaStream);*/
    },

    // Error Callback
    function(err) {
      // Log the error to the console.
      console.log('The following error occurred when trying to use getUserMedia: ' + err);
    }
  );

} else {
  alert('Sorry, your browser does not support getUserMedia');
}
    
}
