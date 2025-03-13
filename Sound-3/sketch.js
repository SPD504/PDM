let anvil;
let osc, noise, env, filter, lfo, vibrato;

function preload() {
  anvil = loadImage("media/falling-anvil.jpg"); 
}

function setup() {
  createCanvas(400, 400);
  background(220); 

  osc = new Tone.MetalSynth({
    frequency: 250,
    envelope: {
      attack: 0.01,
      decay: 0.4,
      sustain: 0,
      release: 0.3
    },
    harmonicity: 6,
    modulationIndex: 45,
    resonance: 5000,
    octaves: 2
  }).toDestination();

  noise = new Tone.Noise("white");
  env = new Tone.AmplitudeEnvelope({
    attack: 0.01,
    decay: 0.2,
    sustain: 0,
    release: 0.1
  }).toDestination();
  noise.connect(env);

  filter = new Tone.Filter({
    frequency: 1500, 
    type: "lowpass", 
    Q: 10
  }).toDestination();

  lfo = new Tone.LFO(6, 500, 2000).start();
  lfo.connect(filter.frequency);

  vibrato = new Tone.Vibrato({
    frequency: 8,
    depth: 0.6
  }).toDestination();

  osc.connect(vibrato);
  osc.connect(filter);

}

function draw() {
  background(200);
}

function mouseClicked() {
  Tone.start().then(() => { 
  if (Tone.context.state !== 'running') {
    Tone.context.resume();
  }

  background(200);
  image(anvil, 100, 100, 200, 200);

  playAnvilSound();
}).catch((error) => {
  console.error("AudioContext start failed:", error);
});
}

function playAnvilSound() {
  osc.triggerAttackRelease("C4", 0.5);
  noise.start();
  env.triggerAttackRelease(0.3);
}