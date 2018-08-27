console.log("Audio_art2");

//=========================
// Global varables
//=========================

let song;
let button;
let canvas;
let mic;
let amplitude;

//=========================
// Setup Microphone
//=========================
// Activate mic

function startMic(){
  mic = new p5.AudioIn();
  mic.start();
  console.log('mic activate');

}

function toggleSong() {

  if (song.isPlaying()) {
    song.pause();
    console.log('pause song');

  } else {
    song.play();
    console.log('play song');
  }
}

function preload() {
  song = loadSound('assets/Intro.mp3');
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  background(0);
  canvas.parent('audio_canvas');
  width = windowWidth;
  height = windowHeight;
  width < height ? smlAxis = width : smlAxis = height;

  micButton = createButton('Mic');
  micButton.mouseClicked(startMic);

  playButton = createButton('Play');
  playButton.mouseClicked(toggleSong);

}

function draw() {
  width = windowWidth;
  height = windowHeight;

  if (mic === undefined ) {
    return;
  } else {
    // circle for mic input
    let vol = mic.getLevel();
    // console.log(vol);
    fill(255, 204, 0);
    stroke('red');

    // Draw an ellipse with height based on volume
    let h = map(vol*100, 0, 1, height, 0);
    ellipse(width/2, h - 25, 50, 50);


    // art for amplitude (pink)
    amplitude = new p5.Amplitude();
    let level = amplitude.getLevel();
    fill('#fae')
    // console.log(level);
    let a = map(amplitude, 0, 10, height, 0);
    ellipse(width/3, h - 25, 50, 50);

    // Threshold art (green)
    let threshold = 0.1;
    if (vol > threshold) {
      stroke(255);
      fill(155,100);
      rect(random(40, width), random(height), vol*500, vol*500);
    }

    let y = map(vol, 0, 1, height, 0);
    let ythreshold = map(threshold, 0, 1, height, 0);

    noStroke();
    fill('green');
    rect(0,0, 20, height);

    fill(255);
    rect(0, y, 20, y);
    stroke(255);
    line(0, ythreshold, 19, ythreshold);
  }
}




//=========================
// Get BPM
//=========================
// draw circle with the data of the output

  // console.log(vol);


// set gain to control avtive and not active

//=========================
// Setup global varables for data
//=========================
// get the source output data (understand the data)
