//不能将matter.js渲染所用的画布直接用p5创建的画布代替，否则虽然物理引擎仍然正常工作，但是渲染不出效果

//可以知道的是matter默认创建的画布大小也是800x600（这里p5创建的也是800x600）
//要想和matter位置保持一致，需要设置p5的rectMode为CENTER（p5的rectMode默认为CORNER）

function setup() {
  createCanvas(800,600);
  background(128);

  const Engine = Matter.Engine
  const Render = Matter.Render
  const Bodies = Matter.Bodies
  const Composite = Matter.Composite
  const Runner = Matter.Runner

  // 3. 创建引擎
  let engine = Engine.create({
    gravity:{
      scale:0.00001//让重力为0.00001，便于观察p5和matter的坐标系统
    }
  })
  // 4. 创建渲染器，并将引擎连接到画布上
  let render = Render.create({
    // element: document.getElementById('defaultCanvas0'), // 不能将matter.js渲染所用的画布直接用p5创建的画布代替
    element: document.getElementById('mattercanvas'), // 必须使用新的画布
    engine: engine, // 绑定引擎
    options:{
      wireframes:false
    }
  })
  // 5-1. 创建两个正方形
  boxA = Bodies.rectangle(width/2, height/2, 80, 80)
  boxB = Bodies.rectangle(0, 0, 80, 80)
  // 5-2. 创建地面，将isStatic设为true，表示物体静止
  let ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true })
  // 6. 将所有物体添加到世界中
  Composite.add(engine.world, [boxA, boxB, ground])
  // 7. 执行渲染操作
  Render.run(render)
  // 8. 创建运行方法
  let runner = Runner.create()
  // 9. 运行渲染器
  Runner.run(runner, engine)
}

function draw() {
  rectMode(CENTER);
  rect(0, 0, 80, 80);
  rect(width/2, height/2, 80, 80);
}
