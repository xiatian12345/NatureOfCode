class Box{
  constructor(pos,w,h){
    this.pos = pos.copy();
    this.w = w;
    this.h = h;
    this.body = Bodies.rectangle(this.pos.x,this.pos.y,w,h);
    Composite.add(engine.world, this.body);
  }

  update(){
    this.pos.x = this.body.position.x;
    this.pos.y = this.body.position.y;
  }

  display(){
    strokeWeight(2);
    stroke('red');
    noFill();
    rect(this.pos.x,this.pos.y,20,20);
  }
}

const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const Composite = Matter.Composite;
const Runner = Matter.Runner;
let engine,runner;
let boxs = [];

function setup() {
  createCanvas(800,600);
  background(128);

  // 1. 创建引擎
  engine = Engine.create();
  // 2. 创建运行方法
  runner = Runner.create();
  // 3. 运行Runner，让matter中有时间概念
  Runner.run(runner, engine);
}

function draw() {
  //使用p5渲染boxA,boxB,ground
  background(128);
  if(mouseIsPressed){
    boxs.push(new Box(createVector(mouseX,mouseY),20,20));
  }
  for(let i = 0;i < boxs.length;i ++){
    boxs[i].update();
    boxs[i].display();
  }
}
