class Box{
  constructor(pos,w,h,isStatic){
    this.pos = pos.copy();
    this.w = w;
    this.h = h;
    this.isDead = false;
    this.isStatic = !!isStatic;
    let option = {
      isStatic:isStatic
    }
    this.body = Bodies.rectangle(this.pos.x,this.pos.y,w,h,option);
    Composite.add(engine.world, this.body);
  }

  update(){
    this.pos.x = this.body.position.x;
    this.pos.y = this.body.position.y;

    if(this.pos.y > height) {
      this.isDead = true;
      Composite.remove(engine.world,this.body);
    }
  }

  display(){
    strokeWeight(2);
    stroke('red');
    noFill();
    rect(this.pos.x,this.pos.y,this.w,this.h);
  }
}

class Ground extends Box{
  constructor(pos,w,h){
    super(pos,w,h,true);
  }
}

class BoxAndBox{
  constructor(pos,r){
    this.pos = pos.copy();
    this.r = r;
    this.isDead = false;

    this.body1 = Bodies.circle(this.pos.x,this.pos.y,this.r);
    this.body2 = Bodies.circle(this.pos.x + this.r,this.pos.y,this.r);

    this.constraint = Constraint.create({
      bodyA:this.body1,
      pointA: { x: -10, y: -10 }, // 设置点A为刚体A的原点

      bodyB:this.body2,
      pointB: { x: -10, y: -10 }, // 设置点B为刚体B的原点

      // length: this.r * 3, // 设置约束的距离
      stiffness:0.005
    })
    Composite.add(engine.world, this.constraint);

    Composite.add(engine.world, this.body1);
    Composite.add(engine.world, this.body2);
  }

  update(){
    this.pos.x = this.body1.position.x;
    this.pos.y = this.body1.position.y;

    if(this.pos.y > height) {
      this.isDead = true;
      Composite.remove(engine.world,this.body1);
      Composite.remove(engine.world,this.body2);
    }
  }

  display(){
    strokeWeight(2);
    stroke('red');
    noFill();
    line(this.body1.position.x,this.body1.position.y,this.body2.position.x,this.body2.position.y);
    fill('green');
    circle(this.body1.position.x,this.body1.position.y,this.r);
    circle(this.body2.position.x,this.body2.position.y,this.r);
    stroke('blue');
    noFill();
    line(this.body1.position.x,this.body1.position.y,this.body1.position.x + this.r/2 * Math.sin(this.body1.angle),this.body1.position.y + this.r/2 * Math.cos(this.body1.angle));
    line(this.body2.position.x,this.body2.position.y,this.body2.position.x + this.r/2 * Math.sin(this.body2.angle),this.body2.position.y + this.r/2 * Math.cos(this.body2.angle));
  }
}


class ParticleSystem{
  constructor(pos){
    this.arr = [];
    this.pos = pos.copy();
  }

  generate(len){
    for(let i = 0;i < len;i ++){
      let r = random(10,30);
      let randPos = p5.Vector.random2D().mult(random(30,60));
      let particle = new BoxAndBox(randPos.add(this.pos),r);
      this.arr.push(particle);
    }
  }

  getNum(){
    return this.arr.length;
  }

  run(){
    this.pos = createVector(mouseX,mouseY);
    strokeWeight(1);
    stroke('black');
    text(`粒子个数${this.getNum()}`,100,100);
    text(`帧率${Math.floor(frameRate())}`,100,120);

    for(let i = this.arr.length - 1;i >= 0;i --){
      let item = this.arr[i];
      if(item.isDead){
        this.arr.splice(i,1);
      }
    }

    this.arr.forEach((p)=>{
      p.update();
      p.display();
    });
  }
}

const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Constraint = Matter.Constraint;
const Runner = Matter.Runner;
let engine,runner;
let particleSystem = null;
let ground1,ground2;

function setup() {
  createCanvas(800,600);
  background(128);
  rectMode(CENTER);

  // 1. 创建引擎
  engine = Engine.create();
  // 2. 创建运行方法
  runner = Runner.create();
  // 3. 运行Runner，让matter中有时间概念
  Runner.run(runner, engine);

  ground1 = new Ground(createVector(200,560),400,30);
  ground2 = new Ground(createVector(600,430),400,30);

  particleSystem = new ParticleSystem(createVector(width/2,100));
}

function draw() {
  //使用p5渲染boxA,boxB,ground
  background(128);
  particleSystem.run();

  ground1.update();
  ground1.display();
  ground2.update();
  ground2.display();
}

function mousePressed(){
  particleSystem.generate(1);
}
