class Mover{
  constructor(initPosition,initSpeed){
    this.size = 30;
    this.position = initPosition.copy();
    this.speed = initSpeed.copy();
    this.acc = p5.Vector.random2D();
    this.speedMag = this.speed.mag();
    this.topSpeed = 25;

    this.noiseDelta = 2;
  }

  update(){
    this.speed.add(this.acc);
    this.speed.limit(this.topSpeed);
    this.position.add(this.speed);
    if(this.position.x > width) {this.position.x = 0; this.noiseDelta += 0.02 ;this.acc=new p5.Vector(noise(this.noiseDelta),noise(this.noiseDelta));}
    if(this.position.x < 0) {this.position.x = width; this.noiseDelta += 0.02 ;this.acc=new p5.Vector(noise(this.noiseDelta),noise(this.noiseDelta));}
    if(this.position.y > height) {this.position.y = 0; this.noiseDelta += 0.02 ;this.acc=new p5.Vector(noise(this.noiseDelta),noise(this.noiseDelta));}
    if(this.position.y < 0) {this.position.y = height; this.noiseDelta += 0.02 ;this.acc=new p5.Vector(noise(this.noiseDelta),noise(this.noiseDelta));}
  }

  display(){
    fill(0,255,0,100);
    noStroke();
    circle(this.position.x,this.position.y,this.size);
  }
}

let mover = null;
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  mover = new Mover(p5.Vector.random2D().setMag(60),p5.Vector.random2D().setMag(15));
}

function draw() {
  mover.update();
  mover.display();
}
