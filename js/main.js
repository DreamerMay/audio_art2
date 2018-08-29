console.log("Audio_art2");

//=========================
// Global varables
//=========================

let button, canvas;
let song, mic, currentSource, amplitude, rms, spectrum, vol, fft;

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

// Noise
let yoff = 0.0;

// Peak detector
let peakDetect;
let ellipseWidth = 10;


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
  frameRate(100);


  // CANVAS SETUP
  canvas.parent('audio_canvas');
  width = windowWidth;
  height = windowHeight;
  width < height ? smlAxis = width : smlAxis = height;

  // AUDIO DATA SETUP
  amplitude = new p5.Amplitude();
  amplitude.setInput(song);
  amplitude.smooth(0.9);

  fft = new p5.FFT(smoothing, binCount);
  fft.setInput(mic);

  //===============
  // USER CONTROL

  $('#microphone').click(function() {
    // MIC SETUP
    mic = new p5.AudioIn();
    mic.start();
    console.log('mic activate');
    clearCanvas();
  })

  $('#play-stop').click(function() {
    if (song.isPlaying()) {
      song.pause();
      console.log('pause song');

    } else {
      song.play();
      console.log('play song');
    }
  })


  // instantiate the particles
  for (var i = 0; i < particles.length; i++) {
    let x = map(i, 0, binCount, 0, width * 2);
    let y = random(0, height);
    let position = createVector(x, y);
    particles[i] = new Particle(position);
  }

  //================
  // Peak detector
  peakDetect = new p5.PeakDetect(4000, 12000, 0.2);
}


function draw() {
  width = windowWidth;
  height = windowHeight;
  background(0);
  noStroke();
  // console.log(frameCount);

  if (mic === undefined ) {
    return;

  } else {


      // yellow circle for mic input
      let vol = mic.getLevel();
      rms = amplitude.getLevel();
      spectrum = fft.analyze(binCount);

      if (song.isPlaying()) {
        fill(0);
        stroke(0)
      } else {
        fill(255, 204, 0);
        stroke('red');

        // Draw an ellipse with height based on volume
        let eh = map(vol*20, 0, 1, height, 0);
        ellipse(width*(2/3), eh - 100, 50, 50);
      }




      // Threshold art (green)
      let volThreshold = 0.1;
      // console.log(rms);
      if (vol > volThreshold) {
        stroke('#fcf688');
        fill('#fcf688');
        rect(random(40, width), random(height), vol*500, vol*500);
      }

      let yt = map(vol, 0, 1, height, 0);
      let ythreshold = map(volThreshold, 0, 1, height, 0);

      noStroke();
      fill(255);
      rect(0,0, 20, height);

      fill(255);
      rect(0, yt, 20, yt);
      stroke(255);
      line(0, ythreshold, 19, ythreshold);

    if (song.isPlaying()) {
    // art for amplitude (pink)
    if (rms > 0.01) {
      fill('#fae');
      stroke(255);
      ellipse(width/3, height/2, 50+rms*300, 50+rms*300);
    }



    // FFT spectrum art

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
    if (rms > 0.01) {
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
    }
    //==================
     // Particles
     for (var i = 0; i < binCount; i++) {
       let thisLevel = map(spectrum[i], 0, 255, 0, 1);

       particles[i].update(thisLevel);
       particles[i].draw();
       particles[i].position.x = map(i, 0, binCount, 0, width*2);
     }

     //================
     // Peak detector
     fft.analyze();
     peakDetect.update(fft);
     fill('blue');

     if (peakDetect.isDetected) {
       ellipseWidth = 200;
     } else {
       ellipseWidth *= 0.95;
     }

     ellipse(width*(2/3), height*(1/3), ellipseWidth, ellipseWidth)

     //====================
     // // Noise Art
     // beginShape();
     // fill('#42fc96');
     // let xoff = 0;
     //
     // for (let xn = 0; xn < width; xn += 10) {
     //   let yn = map(noise(xoff, yoff), 0, 1, 300, 1200);
     //
     //   vertex(xn, yn);
     //   xoff += 0.05;
     // }
     // yoff += 0.01;
     // vertex(width, height);
     // vertex(0, height);
     // endShape(CLOSE);
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
  this.color = [153, 255, 255];
}

let theyExpand = 1;

// use FFT bin level to change speed and diameter
Particle.prototype.update = function(someLevel) {
  this.position.y += this.speed.y / (someLevel*2);
  if (this.position.y > height) {
    this.position.y = 0;
  }
  this.diameter = map(someLevel/2, 0, 1, 0, 100) * this.scale * theyExpand;
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
