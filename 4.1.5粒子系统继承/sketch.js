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


class RectParticle extends Particle{
  constructor(pos,size,lifespan){
    super(pos,size,lifespan);
  }

  display(){
    this.color.setAlpha(this.lifespan);
    push();
      translate(this.pos.x,this.pos.y);
      rotate(this.angle);

      stroke(this.color);
      strokeWeight(2);
      noFill();
      rect(0,0,this.size,this.size);
      fill(this.color);
      noStroke();
      rect(0,0+this.size/4,this.size/2,this.size/2);
    pop();
  }
}
class ParticleSystem{
  constructor(){
    this.arr = [];
    this.pos = createVector(mouseX,mouseY);
  }

  generate(len){
    let rand = random(0,1);
    for(let i = 0;i < len;i ++){
      let life = random(100,300);
      let size = random(10,30);
      let randPos = p5.Vector.random2D().mult(random(30,60));
      let particle = null;
      if(rand > 0.5){
        particle = new Particle(randPos.add(this.pos),size,life);
      }else{
        particle = new RectParticle(randPos.add(this.pos),size,life);
      }
      this.arr.push(particle);
    }
  }

  getNum(){
    return this.arr.length;
  }

  run(){
    this.pos = createVector(mouseX,mouseY);
    text(`粒子个数${this.getNum()}`,100,100);
    text(`帧率${Math.floor(frameRate())}`,100,120);

    for(let i = this.arr.length - 1;i >= 0;i --){
      let item = this.arr[i];
      if(item.isDead){
        this.arr.splice(i,1);
      }
    }

    this.arr.forEach((p)=>{
      p.applyForce(p5.Vector.random2D());
      p.applyTorque(random(-0.1,0.1));
      p.update();
      p.display();
    });
  }
}


let particelSystem = null;
let canGen = true;
function setup() {
  createCanvas(windowWidth,windowHeight);
  particelSystem = new ParticleSystem();
}

function draw() {
  background(255);
  if(mouseIsPressed && canGen){
    canGen = false;
    particelSystem.generate(10);
  }
  particelSystem.run();
}

function mouseReleased(){
  canGen = true;
}