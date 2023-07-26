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

class Chain{
  constructor(fixedStartPos,fixedEndPos,everyRigidBodyWidth,everyRigidBodyHeight){
    // 创建两个固定点
    this.x1 = fixedStartPos.x;
    this.y1 = fixedStartPos.y;
    this.x2 = fixedEndPos.x;
    this.y2 = fixedEndPos.y;

    //构成链条的刚体配置
    this.everyRigidBodyWidth = everyRigidBodyWidth;
    this.everyRigidBodyHeight = everyRigidBodyHeight;
    //构成链条的刚体之间连接的弹簧长度
    let everySpringLength = 5;

    //两端点的距离
    let len = p5.Vector.dist(fixedStartPos,fixedEndPos);
    //总共的刚体个数
    this.rigidBodyCount = Math.floor(len / (everySpringLength + this.everyRigidBodyWidth));

    //创建一组刚体，用于链条的创建
    this.rigidBodyComposite = Composites.stack(this.x1,this.y1,this.rigidBodyCount,1,1,1,(currentX, currentY, column, row, lastBody, i)=>{
      return Bodies.rectangle(currentX, currentY, this.everyRigidBodyWidth, this.everyRigidBodyHeight);
    });

    //把一组刚体和弹簧组成链条
    Composites.chain(this.rigidBodyComposite, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: everySpringLength,render: { type: 'line' }});

    let firstBody = this.rigidBodyComposite.bodies[0];
    let lastBody = this.rigidBodyComposite.bodies[this.rigidBodyComposite.bodies.length - 1];

    //第一个刚体和起始点的固定（约束）
    let startConstraint = Constraint.create({ 
      bodyA: null,
      bodyB: firstBody,
      pointA: { x: firstBody.position.x, y: firstBody.position.y },
      pointB: { x: 0, y: 0 },
      stiffness: 0.5
    });
    //开始端点连接
    Composite.add(this.rigidBodyComposite, startConstraint);

    //最后一个刚体和结束点的固定（约束）
    let endConstraint = Constraint.create({ 
      bodyA: null,
      bodyB: lastBody,
      pointA: { x: lastBody.position.x, y: lastBody.position.y },
      pointB: { x: 0, y: 0 },
      stiffness: 0.5
    });
    //结束端点连接
    Composite.add(this.rigidBodyComposite, endConstraint);

    //放入物理世界中
    Composite.add(engine.world, [this.rigidBodyComposite]);
  }

  display(){
    //画出所有刚体
    noFill();
    stroke('green');
    for(let i = 0;i < this.rigidBodyComposite.constraints.length;i ++){
      let constraint = this.rigidBodyComposite.constraints[i];
      let bodyA = constraint.bodyA;
      let bodyB = constraint.bodyB;
      if(bodyA){
        let verticesArray = bodyA.vertices;
        beginShape();
        for(let i = 0;i < verticesArray.length;i ++){
          let x= verticesArray[i].x;
          let y= verticesArray[i].y;
          vertex(x,y);
        }
        endShape(CLOSE);
      }
      if(bodyB){
        let verticesArray = bodyB.vertices;
        beginShape();
        for(let i = 0;i < verticesArray.length;i ++){
          let x= verticesArray[i].x;
          let y= verticesArray[i].y;
          vertex(x,y);
        }
        endShape(CLOSE);
      }
    }
  }

  update(){

  }
}

const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;
const Composite = Matter.Composite;
const Composites = Matter.Composites;
const Runner = Matter.Runner;
let engine,runner;
let particleSystem = null;
let chain;

function setup() {
  createCanvas(800,600);
  background(128);
  rectMode(CENTER);
  strokeWeight(2);

  // 1. 创建引擎
  engine = Engine.create();
  // 2. 创建运行方法
  runner = Runner.create();
  // 3. 运行Runner，让matter中有时间概念
  Runner.run(runner, engine);

  particleSystem = new ParticleSystem(createVector(width/2,100));

  chain = new Chain(createVector(50,height/2),createVector(width-50,height/2),50,15);
}

function draw() {
  //使用p5渲染boxA,boxB,ground
  background(128);
  if(mouseIsPressed){
    particleSystem.generate(20);
  }
  particleSystem.run();

  chain.update();
  chain.display();
}
