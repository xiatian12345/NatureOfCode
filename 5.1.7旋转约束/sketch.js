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

class RevoluteJoint{
  constructor(pos,w,h){
    this.pos = pos.copy();
    this.w = w;
    this.h = h;
    this.isDead = false;

    this.body = Bodies.rectangle(this.pos.x,this.pos.y,w,h);
    Composite.add(engine.world, this.body);

    var constraint = Constraint.create({
      pointA: { x: this.pos.x, y: this.pos.y },
      bodyB: this.body,
      length: 0
    });
    Composite.add(engine.world, constraint);
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
    push();
    translate(this.pos.x,this.pos.y);
    rotate(this.body.angle);
    strokeWeight(3);
    stroke('green');
    noFill();
    rect(0,0,this.w,this.h);
    stroke('blue');
    circle(0,0,5);
    pop();
  }
}

class ParticleSystem{
  constructor(pos){
    this.arr = [];
    this.pos = pos.copy();
  }

  generate(len){
    for(let i = 0;i < len;i ++){
      let w = random(10,30);
      let h = random(10,30);
      let randPos = p5.Vector.random2D().mult(random(30,60));
      let particle = new Box(randPos.add(this.pos),w,h);
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
let revoluteJoint = null;


function setup() {
  createCanvas(windowWidth,windowHeight);
  background(128);
  rectMode(CENTER);

  // 1. 创建引擎
  engine = Engine.create();
  // 2. 创建运行方法
  runner = Runner.create();
  // 3. 运行Runner，让matter中有时间概念
  Runner.run(runner, engine);

  particleSystem = new ParticleSystem(createVector(width/2,100));

  revoluteJoint = new RevoluteJoint(createVector(width/2,height/2 + 300),400,20);
}

function draw() {
  //使用p5渲染boxA,boxB,ground
  background(128);
  if(mouseIsPressed){
    particleSystem.generate(20);
  }
  particleSystem.run();

  revoluteJoint.update();
  revoluteJoint.display();
}
