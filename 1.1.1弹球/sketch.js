
let xAcc = 3;
let yAcc = 5;

let x = 0;
let y = 0;

function setup() {
  createCanvas(800, 600);
  noStroke();
  fill(128,0,128,128);
  x = width/2;
  y = height/2;
}

function draw() {
  // background('white');
  x += xAcc;
  y += yAcc;

  if(x > width || x < 0) xAcc*=(-1);
  if(y > height || y < 0) yAcc*=(-1);

  circle(x,y,40);
}
