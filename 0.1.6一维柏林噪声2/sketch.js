function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background('white');
  stroke(255,0,0,155);
  frameRate(10);
}

let y = 0;

function draw() {
  y = 0;
  background('white');

  beginShape();

  for(let i = 0;i < width;i ++){
    let a = noise(y)*height;
    vertex(i,a);
    y += 0.01;
  }

  endShape();
}
