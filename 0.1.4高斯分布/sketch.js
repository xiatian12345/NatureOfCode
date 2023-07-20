function setup() {
  createCanvas(window.innerWidth,window.innerHeight);
  background('#777777');
  noStroke();
  fill(255,0,0,5);
}

function draw() {
  translate(width/2,height/2);
  let rand = Math.floor(randomGaussian(0,200));
  let x = rand;
  circle(x,0,80);
}
