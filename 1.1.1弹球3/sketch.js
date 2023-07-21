let position = null;
let acc = null;

let boxSize = 80;
let sphereRadius = boxSize/2;

function setup() {
  createCanvas(160, 160,WEBGL);
  acc = createVector(0.5,0.4,0.3);
  position = createVector(0,0,0);
  strokeWeight(0.1);
}

function draw() {
  background('white');
  rotateX(frameCount * 0.01);
  rotateY(frameCount * 0.01);
  rotateZ(frameCount * 0.01);

  noFill();
  stroke('red');
  box(boxSize);

  position.x += acc.x;
  position.y += acc.y;
  position.z += acc.y;

  if(position.x > sphereRadius/2 || position.x < -sphereRadius/2) {acc.x*=(-1); push();translate(position.x,position.y,position.z);sphere(2);pop();}
  if(position.y > sphereRadius/2 || position.y < -sphereRadius/2) {acc.y*=(-1); push();translate(position.x,position.y,position.z);sphere(2);pop();}
  if(position.z > sphereRadius/2 || position.z < -sphereRadius/2) {acc.z*=(-1); push();translate(position.x,position.y,position.z);sphere(2);pop();}

  noFill();
  stroke('green');
  push();
  translate(position.x,position.y,position.z);
  sphere(boxSize/20);
  pop();
}