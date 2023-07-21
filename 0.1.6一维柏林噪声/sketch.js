let drawLine = null;
let x = 0;
let y = 2;
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
    x += 0.005;
    let rand1 = noise(x) - 0.5;
    let rand2 = noise(y) - 0.5;
    let step = 5;
    drawLine.addNextPoint(rand1 * step, rand2 * step);
  }
}
