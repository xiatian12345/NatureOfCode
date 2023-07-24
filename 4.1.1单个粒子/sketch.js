class Particle{
  constructor(pos,size,lifespan){
    this.lifespan = lifespan;
    this.size = size;
    this.isDead = lifespan > 0;

    this.pos = pos.copy();
    this.vel = createVector();
    this.acc = createVector();

    this.angle = random(0,Math.PI * 2);
    this.angleAcc = 0;
    this.angleVel = 0;

    this.color = color(random(0,255),random(0,255),random(0,255),255);
  }

  applyForce(force){
    this.acc.add(force);
  }

  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.angleVel += this.angleAcc;
    this.angle += this.angleVel;

    this.lifespan -= 3;
    if(this.lifespan <= 0)  {
      this.isDead = true;
      this.lifespan = 0;
    }
  }

  display(){
    this.color.setAlpha(this.lifespan);
    push();
      translate(this.pos.x,this.pos.y);
      rotate(this.angle);

      stroke(this.color);
      strokeWeight(2);
      noFill();
      circle(0,0,this.size);
      fill(this.color);
      noStroke();
      circle(0,0+this.size/4,this.size/2);
    pop();
  }
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  particle = new Particle(createVector(random(0,width),random(0,height)),30,300);
}

function draw() {
  background(255);
  particle.update();
  particle.display();
}
