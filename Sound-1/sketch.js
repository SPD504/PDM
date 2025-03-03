let startContext, samples, button1, button2, button3, button4, delTimeSlider, feedbackSlider, distSlider, wetSlider;
let rev, dist, del;

function preload() {
  // We'll initialize the audio chain in setup instead
}

function setup() {
  createCanvas(400, 400);
  
  // Initialize Tone.js effects after canvas creation
  rev = new Tone.Reverb(0.5).toDestination();
  dist = new Tone.Distortion(2).connect(rev);
  del = new Tone.FeedbackDelay(0, 0).connect(dist); // Note: lowercase 'b' in FeedbackDelay
  del.wet.value = 0.5;
  
  // Initialize samples after effects chain is created
  samples = new Tone.Players({
    pop: "media/pop.mp3",
    boom: "media/boom.mp3",
    badum: "media/badum.mp3",
    pew: "media/pew-pew.mp3"
  }).connect(del);

  let startContext = createButton("Start Audio Context");
  startContext.position(0, 0);
  startContext.mousePressed(startAudioContext); // Note: lowercase 'p' in mousePressed
  
  button1 = createButton("Play Pop");
  button1.position(10, 30);
  button2 = createButton("Play Boom");
  button2.position(90, 30);
  button3 = createButton("Play Badum");
  button3.position(200, 30);
  button4 = createButton("Play Pew");
  button4.position(300, 30);
  
  button1.mousePressed(() => {samples.player("pop").start(); });
  button2.mousePressed(() => {samples.player("boom").start(); });
  button3.mousePressed(() => {samples.player("badum").start(); });
  button4.mousePressed(() => {samples.player("pew").start(); });
  
  delTimeSlider = createSlider(0, 1, 0, 0.01);
  delTimeSlider.position(20, 100);
  delTimeSlider.input(() => {del.delayTime.value = delTimeSlider.value(); });
  
  feedbackSlider = createSlider(0, 0.99, 0, 0.01); // Note: lowercase 'b' in feedbackSlider
  feedbackSlider.position(200, 100);
  feedbackSlider.input(() => {del.feedback.value = feedbackSlider.value(); }); // Note: lowercase 'b' in feedbackSlider
  
  distSlider = createSlider(0, 10, 0, 0.01);
  distSlider.position(10, 200);
  distSlider.input(() => {dist.distortion = distSlider.value(); });
  
  wetSlider = createSlider(0, 1, 0, 0.01);
  wetSlider.position(200, 200);
  wetSlider.input(() => {rev.wet.value = wetSlider.value(); });
}

function draw() {
  background(220);
  textSize(15);
  fill(0);

  text("Delay Time: " + delTimeSlider.value(), 15, 90);
  text("Feedback Amount: " + feedbackSlider.value(), 205, 90); // Note: lowercase 'b' in feedbackSlider
  text("Distortion Amount: " + distSlider.value(), 15, 190); // Fixed typo in "Distortion"
  text("Reverb Wet Amount: " + wetSlider.value(), 205, 190); 
}

function startAudioContext() {
  if (Tone.context.state !== "running") { // Note: capital 'T' in Tone
    Tone.start(); // Note: capital 'T' in Tone
    console.log("Audio Context Started");
  } else {
    console.log("Audio Context is already running");
  }
}