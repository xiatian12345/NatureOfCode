let drawLine = null;
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background('white');

  drawLine = new DrawLine(width/2,height/2,10);
  console.log(drawLine);
}

let montecarloRejectionSampling = function(){
  while(true){
    let rand1 = random(0,1);
    let rand2 = random(0,1);
    if(rand2 < rand1) return rand1;
  }
}

function draw() {
  // background('white');
  drawLine.draw();
  if(!drawLine.isPathing){


    let rand1 = random() > 0.5 ? 1 : -1;
    let rand2 = random() > 0.5 ? 1 : -1;
    let step = 30 * montecarloRejectionSampling();
    drawLine.addNextPoint(rand1 * step, rand2 * step);
  }
}
