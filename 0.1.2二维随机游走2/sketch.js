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
    let rand1 = getRndInteger(-1,1);
    let rand2 = getRndInteger(-1,1);
    let step = 20;
    drawLine.addNextPoint(rand1 * step, rand2 * step);
  }
}
