class Mover{
  constructor(initPosition,initSpeed){
    this.size = 30;
    this.position = initPosition.copy();
    this.speed = initSpeed.copy();
    this.speedMag = this.speed.mag();
  }

  update(){
    this.position.add(this.speed);
    if(this.position.x > width) {this.position.x = 0; this.speed=p5.Vector.random2D().setMag(this.speedMag);}
    if(this.position.x < 0) {this.position.x = width; this.speed=p5.Vector.random2D().setMag(this.speedMag);}
    if(this.position.y > height) {this.position.y = 0; this.speed=p5.Vector.random2D().setMag(this.speedMag);}
    if(this.position.y < 0) {this.position.y =height; this.speed=p5.Vector.random2D().setMag(this.speedMag);}
  }

  display(){
    fill('green');
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
