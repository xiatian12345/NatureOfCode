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

class Polygon{
  constructor(pos,vertices){
    this.vertices = vertices;
    this.pos = pos.copy();
    this.isDead = false;
    this.body = Bodies.fromVertices(this.pos.x,this.pos.y,vertices);//Bodies.rectangle(this.pos.x,this.pos.y,w,h,option);
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
    stroke('green');
    noFill();
    beginShape();
    for(let i = 0;i < this.vertices.length;i ++){
      let x = this.vertices[i].x + this.pos.x;
      let y = this.vertices[i].y + this.pos.y;
      vertex(x,y);
    }
    endShape(CLOSE);
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
      // let particle = new Box(randPos.add(this.pos),w,h);

      const vertices = [
        { x: 10, y: 20 },
        { x: 20, y: 15 },
        { x: 30, y: 25 },
        { x: 25, y: 30 },
        { x: 15, y: 30 }
      ];

      let particle = new Polygon(randPos.add(this.pos),vertices.map((item)=>{return {x:item.x+random(-3,3),y:item.y+random(-3,3)}}));
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

  particleSystem = new ParticleSystem(createVector(width/2,100));

  ground1 = new Ground(createVector(200,560),400,30);
  ground2 = new Ground(createVector(600,500),400,30);
}

function draw() {
  //使用p5渲染boxA,boxB,ground
  background(128);
  if(mouseIsPressed){
    particleSystem.generate(20);
  }
  particleSystem.run();

  ground1.update();
  ground1.display();
  ground2.update();
  ground2.display();
}
