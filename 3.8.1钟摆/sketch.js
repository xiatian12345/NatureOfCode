class Pendulum{//anchor + line + circle
  constructor(anchorPos,lineLen,circleSize){
    this.anchorPos = anchorPos;
    this.lineLen = lineLen;
    this.circleSize = circleSize;

    this.circlePos = createVector();

    this.angle = Math.PI/(random(2.5,4));
    this.angleVel = 0;

    this.gravity = 0.005;

    this.angleAcc = Math.sin(this.angle) * this.gravity;
  }

  update(){
    this.angleAcc = -1 * Math.sin(this.angle) * this.gravity;

    this.angleVel += this.angleAcc;
    this.angle += this.angleVel;

    this.angleVel *= 0.999;

    let x = this.anchorPos.x + Math.sin(this.angle) * this.lineLen;
    let y = this.anchorPos.y + Math.cos(this.angle) * this.lineLen;
    this.circlePos.set(x,y);
  }

  getCirclePos(){
    return this.circlePos.copy();
  }

  setAnchorPos(pos){
    this.anchorPos = pos.copy();
  }

  display(){
    //anchor
    noStroke();
    fill(255,0,0,255);
    circle(this.anchorPos.x,this.anchorPos.y,10);
    //line
    stroke(0,255,0,255);
    strokeWeight(3);
    line(this.anchorPos.x,this.anchorPos.y,this.circlePos.x,this.circlePos.y);
    //circle
    noStroke();
    fill(0,0,255,255);
    circle(this.circlePos.x,this.circlePos.y,this.circleSize);
  }
}

let pendulm = null;
let pendulm2= null;
function setup() {
  createCanvas(windowWidth, windowHeight);
  pendulm = new Pendulum(createVector(width/2,80),200,40);
  pendulm2 = new Pendulum(pendulm.getCirclePos(),100,60);
}

function draw() {
  background(255);
  pendulm.update();
  pendulm.display();

  pendulm2.setAnchorPos(pendulm.getCirclePos());
  pendulm2.update();
  pendulm2.display();
}
