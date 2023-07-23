let r = 10;//极坐标的长度（向量的大小）
let theta = 0;//极坐标的角度（向量的方向）

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background('DodgerBlue');
  strokeWeight(2);
  fill('green');
  stroke('green');
}

function draw() {
  // background('DodgerBlue');
  let x = r * Math.cos(theta);
  let y = r * Math.sin(theta);
  theta += 0.05;
  // line(width/2,height/2,width/2 + x,height/2 + y);
  circle(width/2 + x,height/2 + y,20);
  r += 0.2;
}
