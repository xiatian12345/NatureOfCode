class Circle{
  constructor(pos,size,m){
    this.pos = pos;
    this.size = size;
    this.m = m;

    this.vel = createVector();
    this.acc = createVector();
  }

  applyForce(force){
    this.acc.add(force);
  }

  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);

    this.acc.mult(0);
  }

  getPos(){
    return this.pos.copy();
  }

  display(){
    fill(255,0,0,255);
    noStroke();
    circle(this.pos.x,this.pos.y,this.size);
  }
}

class Spring{
  constructor(k,anchorPos,staticLen){
    this.angle = random(Math.PI/3,Math.PI/3 + Math.PI/2);
    this.k = k;
    this.anchorPos = anchorPos;
    this.staticLen = staticLen;
  }

  getEndPos(){
    return this.anchorPos.copy().add(createVector(Math.cos(this.angle)*this.staticLen,Math.sin(this.angle)*this.staticLen));
  }

  connect(circle){
    this.circle = circle;
    let sub = p5.Vector.sub(this.anchorPos,circle.getPos());
    let dir = sub.normalize();
    let size = -1 * this.k * (sub.mag() - this.staticLen);
    return dir.mult(size);
  }

  display(){
    strokeWeight(2);
    stroke(0,255,0,255);
    line(this.anchorPos.x,this.anchorPos.y,this.circle.pos.x,this.circle.pos.y);
  }
}

let cir = null;
let spring = null;
function setup() {
  createCanvas(windowWidth, windowHeight);
  background('DodgerBlue');

  spring = new Spring(0.02,createVector(width/2,height/2),300);
  let springEndpos = spring.getEndPos();
  cir = new Circle(springEndpos,30,0.5);

  frameRate(30);
}

function draw() {
  background('DodgerBlue');


  cir.applyForce(spring.connect(cir));
  cir.applyForce(createVector(0,1));
  cir.update();

  spring.display();
  cir.display();
}
