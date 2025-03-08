let synth, metalSynth, noiseSynth;
let filter, reverb;
let filterSlider, reverbSlider;
let currentSynth = 'synth';

const keyNotes = {
  'a': 'C4',
  'w': 'C#4',
  's': 'D4',
  'e': 'D#4',
  'd': 'E4',
  'f': 'F4',
  't': 'F#4',
  'g': 'G4',
  'y': 'G#4', 
  'h': 'A4',
  'u': 'A#4',
  'j': 'B4',
  'k': 'C5'
};

function setup() {
  createCanvas(400, 400);

  filter = new Tone.Filter(800, "lowpass",-96).toDestination();
  reverb = new Tone.Reverb({decay: 2, wet: 0.5}).connect(filter);
  synth = new Tone.Synth({
    envelope: {
      attack: 0.9,
      decay: 1,
      sustain: 0.5,
      release: 1
    },
    oscillator: {
      type: 'sawtooth'
    }
  }).connect(reverb);

  metalSynth = new Tone.MetalSynth({
    envelope: {
      attack: 0.05,
      decay: 0.8,
      release: 0.5,
    },
    harmonicity: 1.5,
    modulationIndex: 10
  }).connect(reverb);

  const noiseEnv = new Tone.AmplitudeEnvelope({
    attack: 0.01,
    decay: 0.5,
    sustain: 1,
    release: 0.2
  }).connect(reverb);

  noiseSynth = new Tone.Noise('pink').connect(noiseEnv);
  noiseSynth.start();
  noiseSynth.env = noiseEnv;

  filterSlider = createSlider(200, 5000, 1000);
  filterSlider.position(20, 320);
  filterSlider.input(() => {
    filter.frequency.value = filterSlider.value();
  });
  
  reverbSlider = createSlider(0, 1, 0.8, 0.01);
  reverbSlider.position(200, 320);
  reverbSlider.input(() => {
    reverb.wet.value = reverbSlider.value();
  });

    const synthBtn = createButton('Synth');
    synthBtn.position(20, 350);
    synthBtn.mousePressed(() => { currentSynth = 'synth'; });

    const metalBtn = createButton('Metal');
    metalBtn.position(80, 350);
    metalBtn.mousePressed(() => { currentSynth = 'metal'; });

    const noiseBtn = createButton('Noise');
    noiseBtn.position(140, 350);
    noiseBtn.mousePressed(() => { currentSynth = 'noise'; });
}

function draw() {
  background(220);

  drawKeyboard();

  fill(0);
  textSize(14);
  text("Filter", 50, 245);
  text("Reverb", 230, 245);
  text("Current: " + currentSynth, 220, 280);

  textSize(16);
  text("Press A-K for notes", 150, 20);
  text("Press SPACE bar for noise", 150, 40);
}

function drawKeyboard() {
  const keyWidth = 30;
  const keyHeight = 100;
  const blackKeyWidth = 20;
  const blackKeyHeight = 60;
  
  let x = 50;
  for (let key of ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k']) {
    fill(255);
    rect(x, 60, keyWidth, keyHeight);
    fill(0);
    text(key, x + 10, 150);
    x += keyWidth;
  }
  
  x = 50 + keyWidth - blackKeyWidth/2;
  for (let i = 0; i < 7; i++) {
    if (i !== 2 && i !== 6) {
      fill(0);
      rect(x, 60, blackKeyWidth, blackKeyHeight);
      fill(255);
      text(['w', 'e', 't', 'y', 'u'][i === 0 ? 0 : i === 1 ? 1 : i === 3 ? 2 : i === 4 ? 3 : 4], 
           x + 5, 100);
    }
    x += keyWidth;
  }
}

function keyPressed() {
  const note = keyNotes[key];

  if (note) {
    switch(currentSynth) {
      case 'synth':
        synth.triggerAttack(note);
        break;
      case 'metal':
        metalSynth.triggerAttack(note);
        break;
    }
  } else if (key === ' ' && currentSynth === 'noise') {
    noiseSynth.env.triggerAttack();
  }
  
  return false;
}

function keyReleased() {
  const note = keyNotes[key];
  
  if (note) {
    switch(currentSynth) {
      case 'synth':
        synth.triggerRelease();
        break;
      case 'metal':
        metalSynth.triggerRelease();
        break;
    }
  } else if (key === ' ' && currentSynth === 'noise') {
    noiseSynth.env.triggerRelease();
  }
  
  return false;
}



