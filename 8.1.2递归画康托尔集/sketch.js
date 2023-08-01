function drawCantor(pos1,pos2,d,h){
  let dist = p5.Vector.dist(pos1,pos2);
  if(dist > 0.000001 && d > 0){
    noFill();
    strokeWeight(d);
    line(pos1.x,pos1.y,pos2.x,pos2.y);

    let dir = p5.Vector.sub(pos2,pos1).normalize();
    let pos3 = pos1.copy().add(dir.copy().mult(1/3*dist));
    let pos4 = pos1.copy().add(dir.copy().mult(2/3*dist));

    drawCantor(createVector(pos1.x,pos1.y+h),createVector(pos3.x,pos3.y+h),d*0.8,h);
    drawCantor(createVector(pos4.x,pos4.y+h),createVector(pos2.x,pos2.y+h),d*0.8,h);
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  drawCantor(createVector(0,20),createVector(width,20),18,50);
}

function draw() {

}
