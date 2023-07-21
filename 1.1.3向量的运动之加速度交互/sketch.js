class Mover{
  constructor(initPosition,initSpeed){
    this.size = 30;
    this.position = initPosition.copy();
    this.speed = initSpeed.copy();
    this.acc = p5.Vector.random2D();
    this.speedMag = this.speed.mag();
    this.topSpeed = 45;
  }

  applyMouse(){
    const mouse = createVector(mouseX,mouseY);
    const sub = p5.Vector.sub(mouse,this.position);
    sub.normalize();
    sub.setMag(20);

    this.acc.add(sub);
  }

  update(){
    this.applyMouse();

    this.speed.add(this.acc);
    this.speed.limit(this.topSpeed);
    this.position.add(this.speed);

    if(this.position.x > width || this.position.x < 0 || this.position.y > height || this.position.y < 0){
      this.position = createVector(mouseX,mouseY);
    }
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
  mover = new Mover(p5.Vector.random2D().setMag(60),p5.Vector.random2D().setMag(1));
}

function draw() {
  mover.update();
  mover.display();
}
