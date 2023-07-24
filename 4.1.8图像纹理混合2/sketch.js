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
    this.pos = createVector(windowWidth/2,windowHeight/2);
  }

  generate(len){
    for(let i = 0;i < len;i ++){
      let life = random(10,80);
      let size = random(15,25);
      let randPos = p5.Vector.random2D().mult(random(5,10));
      let particle = new Particle(randPos.add(this.pos),size,life,this.img);
      this.arr.push(particle);
    }
  }

  applyForce(force){
    this.arr.forEach((p)=>{
      p.applyForce(force);
    });
  }

  getNum(){
    return this.arr.length;
  }

  run(){
    // this.pos = createVector(mouseX,mouseY);
    stroke(255);
    text(`粒子个数${this.getNum()}`,100,100);
    text(`帧率${Math.floor(frameRate())}`,100,120);

    for(let i = this.arr.length - 1;i >= 0;i --){
      let item = this.arr[i];
      if(item.isDead){
        this.arr.splice(i,1);
        this.generate(1);
      }
    }

    this.arr.forEach((p)=>{
      // p.applyForce(p5.Vector.random2D());
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
  particelSystem.generate(200);
}

function draw() {
  background(0);
  let windX = map(mouseX - windowWidth/2,-windowWidth/2,windowWidth/2,-0.1,0.1);
  let windY = map(mouseY - windowHeight/2,-windowHeight/2,windowHeight/2,-0.1,0.1);
  let wind = createVector(windX,windY);
  particelSystem.applyForce(wind);
  particelSystem.run();
}
