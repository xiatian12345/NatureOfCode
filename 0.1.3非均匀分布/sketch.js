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
    let step = 20;
    let rand = random() > 0.7 ? true : false;
    //百分之七十概率跟随鼠标游走
    let rand1,rand2;
    if(rand){
      rand1 = (mouseX - drawLine.currentX) < 0 ? -1 : 1;
      rand2 = (mouseY - drawLine.currentY) < 0 ? -1 : 1;
    }else{
      rand1 = random() > 0.5 ? 1 : -1;
      rand2 = random() > 0.5 ? 1 : -1;
    }
    drawLine.addNextPoint(rand1 * step, rand2 * step);
  }
}
