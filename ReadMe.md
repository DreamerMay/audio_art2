# PROJECT #3: Audio Art
[link to live site](https://www.sherinefoo.com/audio_art2/)

## Audio Art
A site that generates visual art show by abstracting data from the audio input. The User can join the fun by making some loud sound near the mic.

## Inspiration of this project
I have a vision of creating a charity project combining music and least fortunate kids to create a music show. As you know music change a person mood, my goal is to help those kids express their feelings through music. Before I can achieve that, this is where the music project starts.

## How to use
* Two option of input. Microphone or Audio (preloaded in the site)
* Click microphone button for microphone input
* Click play button to start the show :)
* Button will appear again when the song is done
* If you want to stop the music, just refresh the page (for now)


## Objectives
* Create an AWESOME show with music input
* Abstract data from audio to create the visual effects
* Data that abstract for this project :
    1. Microphone amplitude
    2. Threshold of Microphone
    3. Spectrum from FFT (Fast Fourier Transform)
    4. Peak detection
    5. Beat detection
* Visual effect include :
    1. Box in the middle changes with the amplitude level of the audio
    2. Green rectangular on both side changes based on beat detection
    3. Quad rectangular shape on each corner appear when peak of the audio is detected
    4. Particles will appear only when certain level of amplitude
    5. Starfield move towards the screen. The speed of the stars are based on the amplitude

## Technologies
* P5.js
* Javascript
* jQuery
* HTML & CSS

## To Do :
- [ ] Add time setting when specific visual effect should show
- [ ] Add partical circle around in the middle of the screen based on amplitude of audio
- [ ] Add SoundCloud API
- [ ] Add more song and user able to toggle or change song
- [ ] Add stop song function to stop the song anytime user desired
- [ ] Add credit

### My Notes
* To run it on local, input this code in terminal `python -m SimpleHTTPServer`
* https://codepen.io/DonKarlssonSan/post/fun-with-web-audio-api
