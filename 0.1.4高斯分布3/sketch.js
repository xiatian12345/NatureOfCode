let drawLine = null;

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background('white');

  drawLine = new DrawLine(width/2,height/2,10);
  console.log(drawLine);
}

function draw() {
  // background('white');
  drawLine.draw();
  if(!drawLine.isPathing){
    let rand1 = Math.floor(randomGaussian(0,40));
    let rand2 = Math.floor(randomGaussian(0,40));
    let step = 1;
    drawLine.addNextPoint(rand1 * step, rand2 * step);
  }
}
