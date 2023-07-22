class Balloon{
  constructor(position,r){
    this.r = r;
    this.c = color(random(0,255),random(0,255),random(0,255));
    //pi * r * r * 厚度 * 密度 === m;
    this.m = r * r * 0.01;
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
    newForce.mult(0.0005);
    //把质量加上
    let acc = newForce.mult(this.m);
    this.acc.add(acc);
  }

  display(){
    noStroke();
    fill(this.c);
    circle(this.pos.x,this.pos.y,this.r);
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

  getR(){
    return this.r;
  }
}

let balloons = [];
let edgeSize = 50;
let balloonCount = 50;
let bolinUD = 0;
let bolinLR = 2;

function setup() {
  createCanvas(800, 600);
  background('#F8F8FF');

  for(let i = 0;i < balloonCount; ++i){
    let pos = createVector(random(0,width/2 - edgeSize),random(0,height-edgeSize));
    let r = random(2,30);
    balloons.push(new Balloon(pos,r));
  }
}

function draw() {
  background('#F8F8FF');

  //风力(向上或者向下 柏林噪声产生)
  bolinUD += 0.01;
  bolinLR += 0.01;
  let randUD = noise(bolinUD) - 0.5;//-0.5 到 0.5之间
  let randLR = noise(bolinLR) - 0.5;//-0.5 到 0.5之间
  let wind = createVector(30 * randLR,30 * randUD);

  //重力(向下)
  let gravity = createVector(0,-10);

  for(let i = 0;i < balloonCount;i ++){
    let balloon = balloons[i];
    let balloonSize = balloon.getR();

    balloon.applyForce(wind);

    balloon.applyForce(gravity);

    //浮力(向上 和面积成正比)
    // let floatForce = createVector(0,balloonSize * balloonSize * 0.01);
    
    //浮力(向上)
    let floatForce = createVector(0,15);

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
      let bounceForce = createVector(0,-240);
      balloon.applyForce(bounceForce);
    }

    //碰到地板时的弹力(向上)
    let pos2 = balloon.getPos();
    if(pos2.y >= height - balloonSize/2){
      balloon.setVel(createVector(Infinity,0));
      let bounceForce = createVector(0,240);
      balloon.applyForce(bounceForce);
    }

    //碰到天花板时的弹力(向左)
    let pos3 = balloon.getPos();
    if(pos3.x >= width - balloonSize/2){
      balloon.setVel(createVector(0,Infinity));
      let bounceForce = createVector(-240,0);
      balloon.applyForce(bounceForce,false);
    }

    //碰到地板时的弹力(向右)
    let pos4 = balloon.getPos();
    if(pos4.x <= balloonSize/2){
      balloon.setVel(createVector(0,Infinity));
      let bounceForce = createVector(240,0);
      balloon.applyForce(bounceForce,false);
    }

    balloon.update();
    balloon.display();
  }
}
