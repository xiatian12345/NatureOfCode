function drawCircle(x,y,r,d){
  if(r > 1){
    noFill();
    strokeWeight(d < 0 ? 1 : d);
    circle(x,y,r);
    drawCircle(x-r/2,y,r/2,d-1);
    drawCircle(x+r/2,y,r/2,d-1);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  drawCircle(width/2,height/2,800,8);
}

function draw() {

}
