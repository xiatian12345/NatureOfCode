class Balloon{
  constructor(position){
    this.size = balloonSize;
    this.acc = createVector(0,0);
    this.vel = createVector(0,0);
    this.pos = position.copy();
  }

  applyForce(force,isRevert){
    let newForce = force.copy();
    //统一处理一下受力方向问题，因为笛卡尔坐标系和p5坐标系相反，因此做一个反转
    if(isRevert || isRevert===undefined){
      newForce.mult(-1);
    }
    //统一弄一个比率
    newForce.mult(0.01);
    this.acc.add(newForce);
  }

  display(){
    noStroke();
    fill('#1E90FF');
    circle(this.pos.x,this.pos.y,this.size);
  }

  update(){
    this.vel.add(this.acc);//速度=速度+加速度
    this.pos.add(this.vel);//位置=位置+速度
    this.acc.mult(0);//每帧中将加速度清零
  }

  getAcc(){
    return this.acc.copy();
  }

  getVel(){
    return this.vel.copy();
  }

  getPos(){
    return this.pos.copy();
  }

  setVel(vel){
    //假设Infinity分量表示不设置该方向的速度
    this.vel.set(vel.x === Infinity ? this.vel.x : vel.x,vel.y === Infinity ? this.vel.y : vel.y);
  }
}

let balloon = null;
let balloonSize = 50;
let bolinUD = 0;
let bolinLR = 2;

function setup() {
  createCanvas(800, 600);
  background('#F8F8FF');

  balloon = new Balloon(createVector(width/2,height-balloonSize/2));
}

function draw() {
  background('#F8F8FF');

  //风力(向上或者向下 柏林噪声产生)
  bolinUD += 0.01;
  bolinLR += 0.01;
  let randUD = noise(bolinUD) - 0.5;//-0.5 到 0.5之间
  let randLR = noise(bolinLR) - 0.5;//-0.5 到 0.5之间

  let wind = createVector(30 * randLR,30 * randUD);
  balloon.applyForce(wind);

  //重力(向下)
  let gravity = createVector(0,-10);
  balloon.applyForce(gravity);

  //浮力(向上)
  let floatForce = createVector(0,20);
  balloon.applyForce(floatForce);

  //空气阻力(和运动方向相反，大小和速度成正比)
  let vel = balloon.getVel();
  let dir = vel.y < 0 ? 1 : -1;
  let airForce = createVector(0,2);
  balloon.applyForce(airForce.mult(dir));

  //碰到天花板时的弹力(向下)
  let pos = balloon.getPos();
  if(pos.y <= balloonSize/2){
    balloon.setVel(createVector(Infinity,0));
    let bounceForce = createVector(0,-200);
    balloon.applyForce(bounceForce);
  }

  //碰到地板时的弹力(向上)
  let pos2 = balloon.getPos();
  if(pos2.y >= height - balloonSize/2){
    balloon.setVel(createVector(Infinity,0));
    let bounceForce = createVector(0,200);
    balloon.applyForce(bounceForce);
  }

  //碰到天花板时的弹力(向左)
  let pos3 = balloon.getPos();
  if(pos3.x >= width - balloonSize/2){
    balloon.setVel(createVector(0,Infinity));
    let bounceForce = createVector(-200,0);
    balloon.applyForce(bounceForce,false);
  }

  //碰到地板时的弹力(向右)
  let pos4 = balloon.getPos();
  if(pos4.x <= balloonSize/2){
    balloon.setVel(createVector(0,Infinity));
    let bounceForce = createVector(200,0);
    balloon.applyForce(bounceForce,false);
  }

  balloon.update();
  balloon.display();
}
