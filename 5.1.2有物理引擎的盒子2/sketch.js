//不能将matter.js渲染所用的画布直接用p5创建的画布代替，否则虽然物理引擎仍然正常工作，但是渲染不出效果
//虽然matter有渲染能力，但是我们想实现的效果是使用p5的渲染能力，以及matter的物理模拟能力，在p5中实现物理效果.

let boxA,boxB,ground;
function setup() {
  createCanvas(800,600);
  background(128);

  const Engine = Matter.Engine;
  const Bodies = Matter.Bodies;
  const Composite = Matter.Composite;
  const Runner = Matter.Runner;

  // 1. 创建引擎
  let engine = Engine.create();
  // 2-1. 创建两个正方形
  boxA = Bodies.rectangle(width/2, height/2, 80, 80);
  boxB = Bodies.rectangle(0, 0, 80, 80);
  // 2-2. 创建地面，将isStatic设为true，表示物体静止
  ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
  // 3. 将所有物体添加到世界中
  Composite.add(engine.world, [boxA, boxB, ground]);
  // 4. 创建运行方法
  let runner = Runner.create();
  // 5. 运行Runner，让matter中有时间概念
  Runner.run(runner, engine);
}

function draw() {
  //使用p5渲染boxA,boxB,ground
  background(128);
  rectMode(CENTER);

  noStroke();
  fill(255,0,0,128);
  rect(boxA.position.x,boxA.position.y,80,80);
  rect(boxB.position.x,boxB.position.y,80,80);
  rect(ground.position.x,ground.position.y,810, 60);

  fill(0,128,0,128);
  rect(0, 0, 80, 80);
  rect(width/2, height/2, 80, 80);
}
