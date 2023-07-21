let position = null;
let acc = null;

function setup() {
  createCanvas(800, 600);
  noStroke();
  fill(128,0,128,255);
  acc = createVector(5,8);
  position = createVector(width/2,height/2);
}

function draw() {
  background('white');
  position.x += acc.x;
  position.y += acc.y;

  if(position.x > width || position.x < 0) acc.x*=(-1);
  if(position.y > height || position.y < 0) acc.y*=(-1);

  circle(position.x,position.y,40);
}
