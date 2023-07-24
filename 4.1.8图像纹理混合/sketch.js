class Particle{
  constructor(pos,size,lifespan,img){
    this.lifespan = lifespan;
    this.size = size;
    this.img = img;
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

      image(this.img,0,0,this.size,this.size);
    pop();
  }
}

class ParticleSystem{
  constructor(img){
    this.arr = [];
    this.img = img;
    this.pos = createVector(mouseX,mouseY);
  }

  generate(len){
    for(let i = 0;i < len;i ++){
      let life = random(100,300);
      let size = random(10,30);
      let randPos = p5.Vector.random2D().mult(random(30,60));
      let particle = new Particle(randPos.add(this.pos),size,life,this.img);
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
      // p.applyTorque(random(-0.1,0.1));
      p.update();
      p.display();
    });
  }
}

let particelSystem = null;
let img = null;

function preload(){
  img = loadImage("texture.png");
}

function setup() {
  createCanvas(windowWidth,windowHeight);
  particelSystem = new ParticleSystem(img);
}

function draw() {
  background(0);
  if(mouseIsPressed){
    particelSystem.generate(10);
  }
  particelSystem.run();
}
