console.log("Welcome to Audio Art");

//=========================
// Global varables
//=========================

let button, canvas;
let song, mic, amplitude, rms, spectrum, volMic, fft;

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
  song = loadSound('assets/flower-of-life-demo.mp3');
}

// Setup starfield
let stars = [];
let speed;

//=========================
// Audio & Canvas Setup
//=========================

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  background(0);
  noStroke();
  frameRate(100);
  // Pick colors randomly
  r = random(255);
  g = random(255);
  b = random(255);

  //=========================
  // Canvas Setup
  //=========================
  canvas.parent('audio_canvas');
  width = windowWidth;
  height = windowHeight;
  width < height ? smlAxis = width : smlAxis = height;

  //=========================
  // Audio Data Setup
  //=========================
  amplitude = new p5.Amplitude();
  amplitude.setInput(song);
  amplitude.smooth(0.9);

  fft = new p5.FFT(smoothing, binCount);
  fft.setInput(song);

  //=========================
  // User Controller
  //=========================
  $('#microphone').click(function() {
    // MIC SETUP
    mic = new p5.AudioIn();
    mic.start();

    console.log('mic activate');
  })

  $('#play').click(function() {
    $("#microphone").fadeOut("slow");
    $("#play").fadeOut("slow");

    mic = new p5.AudioIn();
    mic.start();
    console.log('mic activate');

    if (song.isPlaying()) {
        song.pause();
        console.log('pause song');

    } else {
      song.play();
      console.log('play song');
    }
  })

  // $(window).click(function(){
  //   console.log("window");
  //   $("#play").fadeIn("slow");
  // })

  //============================
  // Instantiate the particles
  //============================
  for (var i = 0; i < particles.length; i++) {
    let x = map(i, 0, binCount, 0, width * 2);
    let y = random(0, height);
    let position = createVector(x, y);
    particles[i] = new Particle(position);
  }

  //=================
  // Peak detector
  //=================
  peakDetect = new p5.PeakDetect(4000, 12000, 0.2);

  //=================
  // Starfield
  //=================
  function Star() {
    this.x = random(-width, width);
    this.y = random(-height, height);
    this.z = random(width);

    this.display = function() {
      noStroke();
      fill(255);
      let sx = map(this.x / this.z, 0, 1, 0, width);
      let sy = map(this.y / this.z, 0, 1, 0, height);
      let r = map(this.z, 0 , width, 12, 0);
      ellipse(sx, sy, r, r);
    } // disply

    this.update = function() {
      this.z -= speed;

      if (this.z < 1) {
        this.z = width;
        this.x = random(-width, width);
        this.y = random(-height, height);
      }
    } // update
  } // Star

  for (let i = 0; i < 800; i++) {
    stars[i] = new Star();
  }

} // setup


function draw()
{
  width = windowWidth;
  height = windowHeight;
  background(0);
  noStroke();


  if (mic === undefined )
    {
      return;
    } else
  {
      // yellow circle for mic input
      let volMic = mic.getLevel();
      rms = amplitude.getLevel();
      spectrum = fft.analyze(binCount);

      if (song.isPlaying())
      {
        fill(0);
        stroke(0)
      } else
      {
        fill(255, 204, 0);
        stroke('red');
        // Draw an ellipse with height based on volume
        let eh = map(volMic*5, 0, 1, height, 0);
        ellipse(width/2, eh - 100, 50, 50);

          $("#microphone").fadeIn("300");
          $("#play").fadeIn("3000");
      }

      // Threshold art (green)
      let volThreshold = 0.15;
      if (volMic > volThreshold)
      {
        stroke('#44a8ff');
        fill('#44a8ff');
        rect(random(40, width), random(height), volMic*500, volMic*500);
      }
    if (song.isPlaying())
    {
      // =========================
      // Rectangle => Amplitude
      //===========================
      push();
        noFill();

        if (rms >= 0.3)
        {
          stroke('#F7FD33');
          strokeWeight(3);
          rect((windowWidth/2)-150, (windowHeight/2) - 50, 300, 100);
        } if (rms >= 0.1)
        {
          stroke('#FDE633');
          strokeWeight(3.5);
          rect((windowWidth/2)-175, (windowHeight/2) - 75, 350, 150);
        } if (rms >= 0.15)
        {
          stroke('#FDD333');
          strokeWeight(4);
          rect((windowWidth/2)-200, (windowHeight/2) - 100, 400, 200);
        } if (rms >= 0.17)
        {
          stroke('#FDBC33');
          strokeWeight(5);
          rect((windowWidth/2)-225, (windowHeight/2) - 125, 450, 250);
        } if (rms >= 0.2)
        {
          stroke('#FDAB33');
          strokeWeight(6);
          rect((windowWidth/2)-250, (windowHeight/2) - 150, 500, 300);
        } if (rms >= 0.25)
        {
          stroke('#FD8F33');
          strokeWeight(8);
          rect((windowWidth/2)-275, (windowHeight/2) - 175, 550, 350);
        } if (rms >= 0.3)
        {
          stroke('#FD7933');
          strokeWeight(10);
          rect((windowWidth/2)-300, (windowHeight/2) - 200, 600, 400);
        } if (rms >= 0.35)
        {
          stroke('#FD6533');
          strokeWeight(12);
          rect((windowWidth/2)-325, (windowHeight/2) - 225, 650, 450);
        } if (rms >= 0.4)
        {
          stroke('#FD5433');
          strokeWeight(14);
          rect((windowWidth/2)-350, (windowHeight/2) - 250, 700, 500);
        } if (rms >= 0.5)
        {
          stroke('#FD3333');
          strokeWeight(16);
          rect((windowWidth/2)-375, (windowHeight/2) - 275, 750, 550);
        } if (rms >= 0.6)
        {
          stroke('#FF0000');
          strokeWeight(17);
          rect((windowWidth/2)-400, (windowHeight/2) - 300, 800, 600);
        }
        pop();

       //===================================
       // Peak detector - 4 side pink angle
       //===================================
       fft.analyze();
       peakDetect.update(fft);

       if (peakDetect.isDetected)
       {
         fill('#FF0651');
         noStroke()
         quad(width - 450, 260, width - 490, 220, width, -100, width, 100); //top right
         quad(370, 260, 400, 220, -100, -100, -100, 100); // top left
         quad(400, height - 210, 370, height - 250, -100, height -90, 40, height + 100); // bottom left
         quad(width - 490, height - 210, width - 450, height - 250, width, height -90, width, height + 100); // bottom right  **

       }

    //======================
    // My Beat Detector Art
    //======================

    // Beat rectangle parameters
    let rectRotate = true;
    let rectMin = 12;
    let rectOffset = 10;
    // let numRects = 5;

    detectBeat(rms);

    if (rms > 0.1)
    {
      // distort the rectable based on amp
      let distortDiam = map(rms, 0, 1, 0, 1200);
      let w = rectMin;
      let h = rectMin;

      let rectCenterPostLeft = createVector(width/4, height/2);
      let rectCenterPostRight = createVector(width - (width/4), height/2);

      push();


        fill('#42fc96');
        noStroke();
        // Beat Rectable left
        for (let i = 0; i < 5; i++) {
          let x = rectCenterPostLeft.x - distortDiam/2;
          let y = rectCenterPostLeft.y + rectOffset * i;

          // Beat Rectable right
          let a = rectCenterPostRight.x + distortDiam/2;
          let b = rectCenterPostRight.y + rectOffset * i;

          rectMode(CENTER);
          // Beat Reactangle Left
          push();
            translate(x, y);
            rect(0, 0, rectMin, rectMin + distortDiam );
          pop();
          push();
            translate(x-50, y);
            rect(0, 0, rectMin, rectMin + distortDiam + 50 );
          pop();
          push();
            translate(x-100, y);
            rect(0, 0, rectMin, rectMin + distortDiam + 100 );
          pop();
          // Beat Rectangle Right
          push()
            translate(a, b);
            rect(0, 0, rectMin, rectMin  + distortDiam);
          pop();
          push()
            translate(a + 50, b);
            rect(0, 0, rectMin, rectMin  + distortDiam + 50 );
          pop();
          push()
            translate(a + 100, b);
            rect(0, 0, rectMin, rectMin  + distortDiam + 100);
          pop();

        }

      pop();
    }

    //=================
    // BPM detector
    //=================
    function detectBeat(level)
    {
      if (level > beatCutoff && level > beatThreshold)
      {
        onBeat();
        beatCutoff = level * 1.2;
        framesSinceLastBeat = 0;
      } else
      {
        if (framesSinceLastBeat <= beatHoldFrames)
        {
          framesSinceLastBeat ++ ;
        } else
        {
          beatCutoff *= beatDecayRate;
          beatCutoff = Math.max(beatCutoff, beatThreshold);
        }
      }
    }

    function onBeat()
    {
      // backgrondColor = color( random(200,255), random(200,255), random(200,255) );
      rectRotate = !rectRotate;
    }

    //==================
    // Particles
    //==================
    noStroke();

    if (rms > 0.4 ) {
       for (var i = 0; i < binCount; i++) {
         let thisLevel = map(spectrum[i], 0, 255, 0, 1);

         particles[i].update(thisLevel);
         particles[i].draw();
         particles[i].position.x = map(i, 0, binCount, 0, width*2);
       } if (rms > 0.6) {
         return;
       }
    }

    // ===============
    // Starfield Art
    // ===============
      push();
      translate(width/2, height/2);
      speed = map(rms*5000, 0, width, 2, 20);
      for (var i = 0; i < stars.length; i++) {
       stars[i].display();
       stars[i].update();
     } // star
    }
  }
};

//=========================
// Particle SETUP
//=========================

let Particle = function(position) {
  this.position = position;
  this.scale = random(0, 1);
  this.speed = createVector(0, random(0,100));
  this.color = [random(0, 255), random(0,255), random(0,255)];
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
  )
};
