let drawLine = null;
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
    let rand = random() > 0.5 ? 1 : -1;
    let step = 20;
    drawLine.addNextPoint(rand * step, 0);
  }
}
