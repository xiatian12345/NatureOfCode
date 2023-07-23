function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(30);
  strokeWeight(3);
}

let angle = 0;
let step = 0.1;
let len = 600;
function draw() {
  background('white');
  angle += step;
  let x = Math.sin(angle) * len + width/2;
  let y = height/2;
  stroke('red');
  line(width/2,height/2,x,y);
  noStroke();
  fill('red');
  circle(x,y,80);
}
