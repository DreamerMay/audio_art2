const audioCtx = new(window.AudioContext || window.wekitAudioContext)();
const analyser = audioCtx.createAnalyser();
const gainNode = audioCtx.createGain();

  const constraints = { audio: true };

  // call getUserMedia
  navigator.mediaDevices.getUserMedia(constraints).then(function(mediaStream) {
    const audio = document.querySelector('audio');
    source = audioCtx.createMediaStreamSource(mediaStream);
    audio.srcObject = mediaStream;
    source.connect(analyser);
    analyser.connect(gainNode);
    gainNode.connect(audioCtx.destination);


    //TODO come back with mute Function
    const mute = document.querySelector('.mute');
    mute.onclick = micMute;

    function micMute() {
      if (mute.id == "") {
        console.log(audioCtx.currentTime);
        gainNode.gain.setValueAtTime(Number.MIN_VALUE, audioCtx.currentTime);

        mute.id = "activated";
        mute.innerHTML = "Unmute";
      } else {
        console.log(audioCtx.currentTime);
        gainNode.gain.setValueAtTime(1, audioCtx.currentTime);
        mute.id = "";
        mute.innerHTML = "Mute";
      }
    };

  }).catch(function(err){
    console.log("Web Audio API not support", err);
  });
