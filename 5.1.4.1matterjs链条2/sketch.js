class Chain{
  constructor(fixedStartPos,fixedEndPos){
    // 创建两个固定点
    let x1 = fixedStartPos.x;
    let y1 = fixedStartPos.y;
    let x2 = fixedEndPos.x;
    let y2 = fixedEndPos.y;

    //构成链条的刚体配置
    let everyRigidBodyWidth = 30;
    let everyRigidBodyHeight = 10;
    //构成链条的刚体之间连接的弹簧长度
    let everySpringLength = 5;

    //两个点的距离
    let len = p5.Vector.dist(fixedStartPos,fixedEndPos);
    //总共的刚体个数
    let rigidBodyCount = Math.floor(len / (everySpringLength + everyRigidBodyWidth));

    if(rigidBodyCount <= 0) {
      throw new Error('can not create chain....');
    }

    //创建一组刚体，用于链条的创建
    let rigidBodyComposite = Composites.stack(x1,y1,rigidBodyCount,1,1,1,(currentX, currentY, column, row, lastBody, i)=>{
      return Bodies.rectangle(currentX, currentY, everyRigidBodyWidth, everyRigidBodyHeight);
    });
    //把一组刚体
    Composites.chain(rigidBodyComposite, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: everySpringLength,render: { type: 'line' }});

    let firstBody = rigidBodyComposite.bodies[0];
    let lastBody = rigidBodyComposite.bodies[rigidBodyComposite.bodies.length - 1];

    //第一个刚体和起始点的固定（约束）
    let startConstraint = Constraint.create({ 
      bodyA: null,
      bodyB: firstBody,
      pointA: { x: firstBody.position.x, y: firstBody.position.y },
      pointB: { x: 0, y: 0 },
      stiffness: 0.5
    });
    //开始端点连接
    Composite.add(rigidBodyComposite, startConstraint);

    //最后一个刚体和结束点的固定（约束）
    let endConstraint = Constraint.create({ 
      bodyA: null,
      bodyB: lastBody,
      pointA: { x: lastBody.position.x, y: lastBody.position.y },
      pointB: { x: 0, y: 0 },
      stiffness: 0.5
    });
    //结束端点连接
    Composite.add(rigidBodyComposite, endConstraint);


    //放入物理世界中
    Composite.add(engine.world, [rigidBodyComposite]);
  }
}

const Engine = Matter.Engine;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Constraint = Matter.Constraint;
const Composite = Matter.Composite;
const Composites = Matter.Composites;
const Runner = Matter.Runner;
const Render = Matter.Render;
let engine = null;
let boxB;

let chain = null;
function setup() {
  createCanvas(0,0);
  // 3. 创建引擎
  engine = Engine.create({
    gravity:{
      scale:0.001//让重力为0.00001，便于观察p5和matter的坐标系统
    }
  })
  // 4. 创建渲染器，并将引擎连接到画布上
  let render = Render.create({
    // element: document.getElementById('defaultCanvas0'), // 不能将matter.js渲染所用的画布直接用p5创建的画布代替
    element: document.getElementById('matter'), // 必须使用新的画布
    engine: engine, // 绑定引擎
    options:{
      wireframes:false,
      width:windowWidth,
      height:windowHeight
    }
  })
  chain = new Chain(createVector(300,windowHeight/2),createVector(windowWidth-300,windowHeight/2));
  // 5-1. 创建两个正方形
  boxB = Bodies.rectangle(windowWidth/2, 0, 80, 80)
  // 5-2. 创建地面，将isStatic设为true，表示物体静止
  let ground = Bodies.rectangle(windowWidth/2, windowHeight-80, windowWidth, 60, { isStatic: true })
  // 6. 将所有物体添加到世界中
  Composite.add(engine.world, [boxB, ground])
  // 7. 执行渲染操作
  Render.run(render)
  // 8. 创建运行方法
  let runner = Runner.create()
  // 9. 运行Runner，让matter中有时间概念
  Runner.run(runner, engine)
}