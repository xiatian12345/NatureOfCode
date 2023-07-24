class Particle{
  constructor(pos,size,lifespan){
    this.lifespan = lifespan;
    this.size = size;
    this.isDead = lifespan <= 0;

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

  applyTorque(torque){
    this.angleAcc += torque;
  }

  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.angleVel += this.angleAcc;
    this.angle += this.angleVel;

    this.lifespan -= 1;
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

class ParticleSystem{
  constructor(len){
    this.arr = [];
    for(let i = 0;i < len;i ++){
      let life = random(200,400);
      let size = random(20,40);
      let particle = new Particle(createVector(random(0,width),random(0,height)),size,life);
      this.arr.push(particle);
    }
  }

  run(){
    let alive = this.arr.filter((item)=>{
      return !item.isDead;
    });
    alive.forEach((p)=>{
      p.applyForce(p5.Vector.random2D());
      p.applyTorque(random(-0.1,0.1));
      p.update();
      p.display();
    });
  }
}


let particelSystem = null;
function setup() {
  createCanvas(windowWidth,windowHeight);
  particelSystem = new ParticleSystem(100);
}

function draw() {
  background(255);
  particelSystem.run();
}
