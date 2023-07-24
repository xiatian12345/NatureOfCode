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
  constructor(pos){
    this.arr = [];
    this.pos = pos;
    this.isDead = false;
  }

  generate(len){
    for(let i = 0;i < len;i ++){
      let life = random(100,300);
      let size = random(10,30);
      let randPos = p5.Vector.random2D().mult(random(30,60));
      let particle = new Particle(randPos.add(this.pos),size,life);
      this.arr.push(particle);
    }
  }

  getNum(){
    return this.arr.length;
  }

  run(){
    for(let i = this.arr.length - 1;i >= 0;i --){
      let item = this.arr[i];
      if(item.isDead){
        this.arr.splice(i,1);
      }
    }

    this.arr.forEach((p)=>{
      p.applyForce(p5.Vector.random2D().mult(0.6));
      p.applyTorque(random(-0.05,0.05));
      p.update();
      p.display();
    });

    this.isDead = this.arr.length <= 0;
  }
}

class ParticleSystemSystem{
  constructor(){
    this.arr = [];
  }

  getNum(){
    return this.arr.map((item)=>{ return item.getNum()}).reduce((acc,curr)=>acc + curr,0);
  }

  getSystemNum(){
    return this.arr.length;
  }

  generateSystem(pos,num){
    let system = new ParticleSystem(pos);
    system.generate(num);
    this.arr.push(system);
  }

  run(){
    text(`粒子系统个数${this.getSystemNum()}`,100,100);
    text(`粒子个数${this.getNum()}`,100,120);
    text(`帧率${Math.floor(frameRate())}`,100,140);

    for(let i = this.arr.length - 1;i >= 0;i --){
      let system = this.arr[i];
      if(system.isDead){
        this.arr.splice(i,1);
      }
    }

    for(let i = 0;i < this.arr.length;i ++){
      let system = this.arr[i];
      system.run();
    }
  }
}

let particelSystemSystem = null;
let canGen = true;
function setup() {
  createCanvas(windowWidth,windowHeight);
  particelSystemSystem = new ParticleSystemSystem();
}

function draw() {
  background(255);
  if(mouseIsPressed && canGen){
    canGen = false;
    particelSystemSystem.generateSystem(createVector(mouseX,mouseY),20);
  }

  particelSystemSystem.run();
}


function mouseReleased(){
  canGen = true;
}