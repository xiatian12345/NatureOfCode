class Chain{
  constructor(fixedStartPos,fixedEndPos){
    // 创建两个固定点
    let x1 = fixedStartPos.x;
    let y1 = fixedStartPos.y;
    let x2 = fixedEndPos.x;
    let y2 = fixedEndPos.y;
    //创建一组刚体，用于链条的创建
    let rigidBodyComposite = Composite.create({
      bodies:[Bodies.rectangle(x1, y1, 320, 10), Bodies.rectangle(x2, y2, 320, 10)]
      // bodies:[Bodies.rectangle(x1, y1, 320, 10), Bodies.rectangle(x2, y2, 320, 10),Bodies.rectangle(x2, y2, 20, 10)]
    });
    //把一组刚体
    let chain = Composites.chain(rigidBodyComposite, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 40});
    console.log(chain);
    // Composites.chain(rigidBodyComposite, 0.5, 0, -0.5, 0, { stiffness: 0.8, length: 40, render: { type: 'line' } });
    let firstBody = rigidBodyComposite.bodies[0];
    let lastBody = rigidBodyComposite.bodies[rigidBodyComposite.bodies.length - 1];

    //第一个刚体和起始点的固定（约束）
    let startConstraint = Constraint.create({ 
      bodyB: firstBody,
      pointB: { x: 0, y: 0 },
      pointA: { x: firstBody.position.x, y: firstBody.position.y },
      stiffness: 0.5
    });
    //开始端点连接
    Composite.add(rigidBodyComposite, startConstraint);

    //最后一个刚体和结束点的固定（约束）
    let endConstraint = Constraint.create({ 
      bodyB: lastBody,
      pointB: { x: 0, y: 0 },
      pointA: { x: lastBody.position.x, y: lastBody.position.y },
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

let chain = null;
function setup() {
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
      wireframes:false
    }
  })
  chain = new Chain(createVector(200,300),createVector(600,300));
  // 5-1. 创建两个正方形
  boxB = Bodies.rectangle(400, 0, 80, 80)
  console.log(boxB);
  // 5-2. 创建地面，将isStatic设为true，表示物体静止
  let ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true })
  // 6. 将所有物体添加到世界中
  Composite.add(engine.world, [boxB, ground])
  // 7. 执行渲染操作
  Render.run(render)
  // 8. 创建运行方法
  let runner = Runner.create()
  // 9. 运行Runner，让matter中有时间概念
  Runner.run(runner, engine)
}