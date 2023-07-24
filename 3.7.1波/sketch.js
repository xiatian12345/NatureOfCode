let span = 20;
let amplitude = 200;
let angle = 0;
let angleVel = 0.2;

function setup() {
  createCanvas(1200, 500);
  background(200);
  noFill();
  stroke(0,0,200,200);

  frameRate(5);
}

function draw() {
  background(200);

  for(let i = 0;i < width;i += span){
    let x = i;
    angle += angleVel;
    let deltaY = amplitude * Math.sin(angle);
    let y = height/2 + deltaY;
    circle(x,y,span/2);
  }
}
