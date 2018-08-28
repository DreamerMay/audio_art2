console.log("Audio_art2");

//=========================
// Global varables
//=========================

let button, canvas;
let song, mic, amplitude, vol, fft;

// Beat rectangle parameters
let rectRotate = true;
let rectMin = 15;
let rectOffset = 20;
let numRects = 10;

// Beat Detect
let beatHoldFrames = 30;
let beatThreshold = 0.11;
let beatCutoff = 0;
let beatDecayRate = 0.98;
let framesSinceLastBeat = 0;

//FFT settings
let smoothing = 0.8;
let binCount = 1024;
let particles = new Array(binCount);



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
  song = loadSound('assets/the_depths.mp3');
}

//=========================
// AUDIO & CANVAS SETUP
//=========================


function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  background(0);
  noStroke();

  canvas.parent('audio_canvas');
  width = windowWidth;
  height = windowHeight;
  width < height ? smlAxis = width : smlAxis = height;



  // AUDIO DATA SETUP
  amplitude = new p5.Amplitude();
  amplitude.setInput(song);
  amplitude.smooth(0.9);

  fft = new p5.FFT(smoothing, binCount);
  fft.setInput(song);

  micButton = createButton('Mic');
  micButton.mouseClicked(startMic);

  playButton = createButton('Play');
  playButton.mouseClicked(toggleSong);

  // instantiate the particles
  for (var i = 0; i < particles.length; i++) {
    let x = map(i, 0, binCount, 0, width * 2);
    let y = random(0, height);
    let position = createVector(x, y);
    particles[i] = new Particle(position);
  }

}

function draw() {
  width = windowWidth;
  height = windowHeight;
  background(0);

  if (mic === undefined ) {
    return;
  } else {
    // circle for mic input
    let vol = mic.getLevel();
    fill(255, 204, 0);
    stroke('red');

    // Draw an ellipse with height based on volume
    let eh = map(vol*100, 0, 1, height, 0);
    ellipse(width/2, eh - 25, 50, 50);


    // art for amplitude (pink)
    let rms = amplitude.getLevel();

    fill('#fae');
    stroke(255);
    ellipse(width/3, height/2, 50+rms*300, 50+rms*300);


    // Threshold art (green)
    let volThreshold = 0.1;
    if (rms > volThreshold) {
      stroke(255);
      fill('#42fc96');
      rect(random(40, width), random(height), vol*10000, vol*10000);
    }

    let yt = map(rms, 0, 1, height, 0);
    let ythreshold = map(volThreshold, 0, 1, height, 0);

    noStroke();
    fill(255);
    rect(0,0, 20, height);

    fill(255);
    rect(0, yt, 20, yt);
    stroke(255);
    line(0, ythreshold, 19, ythreshold);

    // FFT spectrum art
    let spectrum = fft.analyze(binCount);

    beginShape();

    fill('rgba(255,93,115,1)');
    stroke('rgba(50,50,50,1)');
    strokeWeight(1);
    for (let i = 0; i < spectrum.length; i++) {
      vertex(i, map(spectrum[i], 0, 255, height, 0) );
    }
    endShape();

    //========================
    // Beat detector art
    detectBeat(rms);
    rectMode(CENTER);

    // distort the rectable based on amp
    let distortDiam = map(rms, 0, 1, 0, 1200);
    let w = rectMin;
    let h = rectMin;

    // distortion direction shift each beat
    if (rectRotate) {
      var rotation = PI / 2;
    } else {
      var rotation = PI /3;
    }

    let rectCenter = createVector(width/3, height/2);
    push();

      // draw the rectangles
      for (var i = 0; i < numRects; i++) {
        let x = rectCenter.x + rectOffset * i;
        let y = rectCenter.y + distortDiam/2;
        // rotate around the center of this rectangle
        translate(x,y);
        rotate(rotation);
        rect(0, 0, rectMin, rectMin + distortDiam);
      }

    pop();

     // Particles
     for (var i = 0; i < binCount; i++) {
       let thisLevel = map(spectrum[i], 0, 255, 0, 1);

       particles[i].update(thisLevel);
       particles[i].draw();
       particles[i].position.x = map(i, 0, binCount, 0, width*2);
     }
  }
}


//=========================
// BPM detector
//=========================
function detectBeat(level) {
  if (level > beatCutoff && level > beatThreshold) {
    onBeat();
    beatCutoff = level * 1.2;
    framesSinceLastBeat = 0;
  } else {
    if (framesSinceLastBeat <= beatHoldFrames) {
      framesSinceLastBeat ++ ;
    } else {
      beatCutoff *= beatDecayRate;
      beatCutoff = Math.max(beatCutoff, beatThreshold);
    }
  }
}

function onBeat() {
  // backgrondColor = color( random(200,255), random(200,255), random(200,255) );
  rectRotate = !rectRotate;
}


//=========================
// Particle SETUP
//=========================
// Particle class

let Particle = function(position) {
  this.position = position;
  this.scale = random(0, 1);
  this.speed = createVector(0, random(0,10));
  this.color = [255, 255, 255];
}

let theyExpand = 1;

// use FFT bin level to change speed and diameter
Particle.prototype.update = function(someLevel) {
  this.position.y += this.speed.y / (someLevel*2);
  if (this.position.y > height) {
    this.position.y = 0;
  }
  this.diameter = map(someLevel, 0, 1, 0, 100) * this.scale * theyExpand;
}

Particle.prototype.draw = function() {
  fill(this.color);
  ellipse(
    this.position.x, this.position.y, this.diameter, this.diameter
  );
};


function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
}
