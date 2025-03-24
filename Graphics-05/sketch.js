const GameStates = Object.freeze({
  START: "start",
  PLAY: "play",
  END: "end"
});

let currentState = GameStates.START;
let bugs = [];
let squishCount = 0;
let timeRemaining = 30;
let lastSecond = 30;
let speedMultiplier = 1;
let spriteSheet;
const SPRITE_COLS = 4;
const SPRITE_ROWS = 2;
const SPRITE_WIDTH = 80; 
const SPRITE_HEIGHT = 80;
const DISPLAY_SIZE = 50;

let synth, squishSound, missSound, backgroundLoop;

function preload() {
  spriteSheet = loadImage("media/New Piskel.png");
}

function setupSound() {
  synth = new Tone.Synth().toDestination();
  squishSound = new Tone.MembraneSynth().toDestination();
  missSound = new Tone.NoiseSynth({
    noise: { type: "white" },
    envelope: { attack: 0.005, decay: 0.1, sustain: 0 }
  }).toDestination();
  
  backgroundLoop = new Tone.Loop((time) => {
    synth.triggerAttackRelease("C4", "8n", time);
  }, "1m");
}

class Bug {
  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.speed = 3;
    this.direction = createVector(random(-1, 1), random(-1, 1)).normalize();
    this.isSquished = false;
    this.squishTime = 0;
    this.spriteIndex = floor(random(SPRITE_COLS * (SPRITE_ROWS - 1)));
    this.frameIndex = 0;
  }

  update() {
    if (this.isSquished) {
      if (millis() - this.squishTime > 1000) {
        return false; 
      }
      return true;
    }

    this.x += this.direction.x * this.speed * speedMultiplier;
    this.y += this.direction.y * this.speed * speedMultiplier;

    if (this.x < 0 || this.x > width) {
      this.direction.x *= -1;
    }
    if (this.y < 0 || this.y > height) {
      this.direction.y *= -1;
    }

    if (frameCount % 5 === 0) {
      this.frameIndex = (this.frameIndex + 1) % 7;
    }

    return true;
  }

  draw() {
    let sx, sy;

    if (this.isSquished) {
      sx = (SPRITE_COLS - 1) * SPRITE_WIDTH;
      sy = (SPRITE_ROWS - 1) * SPRITE_HEIGHT;
    } else {
      sx = (this.frameIndex % SPRITE_COLS) * SPRITE_WIDTH
      sy = floor(this.frameIndex / SPRITE_COLS) * SPRITE_HEIGHT
    }

    imageMode(CENTER);
    image(spriteSheet, this.x, this.y, 50, 50, sx, sy, SPRITE_WIDTH, SPRITE_HEIGHT);
  }

  checkClick(mx, my) {
    if (!this.isSquished && dist(mx, my, this.x, this.y) < DISPLAY_SIZE / 2) {
      this.isSquished = true;
      this.squishTime = millis();
      this.frameIndex = 7;
      return true;
    }
    return false;
  }
}

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER);
  bugs = [];
  setupSound();
}

function draw() {
  background(220);

  switch (currentState) {
    case GameStates.START:
      drawStartScreen();
      break;
    case GameStates.PLAY:
      drawGameScreen();
      break;
    case GameStates.END:
      drawEndScreen();
      break;
  }
}

function drawStartScreen() {
  textSize(48);
  fill(0);
  text('SQUISH THE BUGS!!', width/2, height/2 - 50);
  textSize(24);
  text('Press Enter to Start!', width/2, height/2 + 50);
}

function drawGameScreen() {
  let currentSecond = ceil(timeRemaining);
  if (currentSecond < lastSecond) {
    lastSecond = currentSecond;
    if (random() < 0.5) {
      bugs.push(new Bug());
    }
  }

  timeRemaining -= deltaTime / 1000;

  
  for (let i = bugs.length - 1; i >= 0; i--) {
    if (!bugs[i].update()) {
      bugs.splice(i, 1);
      continue;
    }
    bugs[i].draw();
  }

  textAlign(LEFT);
  textSize(24);
  fill(0);
  text(`Bugs Squished: ${squishCount}`, 10, 30);
  text(`Time: ${max(0, ceil(timeRemaining))}`, width - 120, 30);

  
  if (timeRemaining <= 0) {
    currentState = GameStates.END;
    timeRemaining = 0;
  }
}

function drawEndScreen() {
  textAlign(CENTER);
  textSize(48);
  text('Game Over! You are TOO SLOW!', width/2, height/2 - 50);
  textSize(32);
  text(`Final Score: ${squishCount}`, width/2, height/2);
  textSize(24);
  text('Press Enter to Play Again!', width/2, height/2 + 50);
}

function keyPressed() {
  if (keyCode === ENTER) {
    switch (currentState) {
      case GameStates.START:
      case GameStates.END:
        startGame();
        break;
    }
  }
}

function mousePressed() {
  if (currentState === GameStates.PLAY) {
    for (let bug of bugs) {
      if (mouseButton === LEFT && bug.checkClick(mouseX, mouseY)){
        squishCount++;
        speedMultiplier += 0.025;
        squishSound.triggerAttackRelease("C2", "16n");
        bugs.push(new Bug());
        break;
      }
    }
  }
}

function startGame() {
  bugs = [];

  let initialBugCount = 20;

      for (let i = 0; i < initialBugCount; i++) {
        bugs.push(new Bug());
      }
      squishCount = 0;
      timeRemaining = 30;
      lastSecond = 30;
      speedMultiplier = 1;
      currentState = GameStates.PLAY;
}