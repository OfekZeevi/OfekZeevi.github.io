var video, ar, canvas, context;

window.onload = function () {

    video = document.querySelector("video#camera-stream");
    canvas = document.querySelector("canvas#frame");
    context = canvas.getContext("2d");
    
    var constraints = { 
        video: { 
            facingMode: "environment"
        }
    };
  
    function handleSuccess(stream)
    {
        var videoTracks = stream.getVideoTracks();
        console.log('Got stream with constraints:', constraints);
        console.log('Using video device: ' + videoTracks[0].label);
        stream.oninactive = function() {
            console.log('Stream inactive');
        };
        window.stream = stream; // make variable available to browser console
        video.srcObject = stream;
        setupAR();
    }
    
    function handleError(err)
    {
        // Log the error to the console.
        console.log('The following error occurred when trying to use getUserMedia: ' + err);
    }
   
    navigator.mediaDevices.getUserMedia(constraints).then(handleSuccess).catch(handleError);
    
}

function setupAR()
{
    var param = new ARCameraParam();
    
    ar = new ARController(canvas, param);
    ar.setPatternDetectionMode(artoolkit.AR_TEMPLATE_MATCHING_COLOR_AND_MATRIX);
    
    param.onload = function() {
        ar.addEventListener('markerNum', function (ev) {
            console.log('got markers', markerNum);
        });
        
        ar.addEventListener('getMarker', function (ev) {
            console.log('found marker?', ev);
        });
        
        ar.loadMarker('packages/jsartoolkit5-master/examples/Data/patt.hiro', function (marker) {
            console.log('loaded marker', marker);
            
            var img;
            setInterval(function() {
                context.drawImage(video, 0, 0);
                /*img = new Image();
                img.src = canvas.toDataURL();*/
                ar.process();
            }, 1000);
        });
    };
    
    param.src = 'packages/jsartoolkit5-master/examples/Data/camera_para.dat';
}