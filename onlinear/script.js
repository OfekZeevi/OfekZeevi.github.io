window.onload = function () {

    var constraints = { 
        video: { 
            facingMode: "environment"
        }
    };
  
    function handleSuccess(stream)
    {
        // Get a reference to the video element on the page.
        var vid = document.getElementById('camera-stream');
        
        var videoTracks = stream.getVideoTracks();
        console.log('Got stream with constraints:', constraints);
        console.log('Using video device: ' + videoTracks[0].label);
        stream.oninactive = function() {
            console.log('Stream inactive');
        };
        window.stream = stream; // make variable available to browser console
        vid.srcObject = stream;
    }
    
    function handleError(err)
    {
        // Log the error to the console.
        console.log('The following error occurred when trying to use getUserMedia: ' + err);
    }
   
    navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
    
}
