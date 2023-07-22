class Balloon{
  constructor(position,r,isGravity){
    this.isGravity = isGravity;//万有引力
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
    if(this.isGravity) {
      fill(random(0,255),random(0,255),random(0,255));
    }else{
      fill(this.c);
    }
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

  getM(){
    return this.m;
  }

  in(x,y,w,h){
    return (this.pos.x > x) && (this.pos.x < (x + w)) && (this.pos.y > y) && (this.pos.y < (y + h));
  }
}

class AttractionCircle{
  constructor(pos,c,m,isReverse){
    this.pos = pos.copy();
    this.isReverse = isReverse;
    this.m = m;
    this.size = 30;
    this.c = c;
  }

  getM(){
    return this.m;
  }

  getIsReverse(){
    return this.isReverse;
  }

  getPos(){
    return this.pos;
  }

  display(){
    fill(this.c);
    circle(this.pos.x,this.pos.y,this.size);

    fill(random(0,255),random(0,255),random(0,255))
    circle(this.pos.x,this.pos.y,this.size/8);
  }
}

let balloons = [];
let balloonsGravity = [];
let edgeSize = 50;
let balloonCount = 50;
let bolinUD = 0;
let bolinLR = 2;

let attractionCircles = [];
let attractionCircle = null;
let attractionCircleRev = null;

function setup() {
  createCanvas(800, 600);
  background('#F8F8FF');

  for(let i = 0;i < balloonCount; ++i){
    let pos = createVector(random(0,width/2 - edgeSize),random(0,height-edgeSize));
    let r = random(8,36);
    let isGravity = random(0,1) > 0.8;//是否模拟万有引力
    let balloon = new Balloon(pos,r,isGravity);
    balloons.push(balloon);
    if(isGravity) balloonsGravity.push(balloon);
  }

  let friction = createP('摩擦力区域');
  friction.position(window.innerWidth/2 - width/2 +10,window.innerHeight/2 + height/2);

  let acc = createP('加速区域');
  acc.position(window.innerWidth/2 - width/2 +10 + 200,window.innerHeight/2 + height/2);

  let flu = createP('流体阻力区域');
  flu.position(window.innerWidth/2 - width/2 + 400,window.innerHeight/2 + height/2);

  for(let i = 0;i < 2;i ++){
    let c = (i % 2 === 0 ? color(255,0,0,255) : color(0,0,255,255))
    let isRev = i % 2 === 1;
    let delta = isRev ? 100 : -100;
    let att = new AttractionCircle(createVector(width/4*3 + 30,height/2 - delta),c,10, isRev);
    attractionCircles.push(att);
  }
}

function draw() {
  background('#F8F8FF');
  //摩擦力区域
  fill(120,0,120,100);
  rect(0,0,100,600);

  //加速区域
  fill(0,120,120,100);
  rect(200,0,100,600);

  //流体阻力区域
  fill(120,120,0,100);
  rect(400,0,100,600);

  //引力球
  for(let i = 0;i < 2;i ++){
    attractionCircles[i].display();
  }

  //万有引力
  for(let m = 0;m < balloonsGravity.length;m ++){
    let cirle1 = balloonsGravity[m];
    for(let n = m + 1;n < balloonsGravity.length;n ++){
      let cirle2 = balloonsGravity[n];

      let pos1 = cirle1.getPos();
      let pos2 = cirle2.getPos();

      let m1 = cirle1.getM();
      let m2 = cirle2.getM();

      let ratio = 36;

      let force = (m1 * m2) / (p5.Vector.dist(pos1,pos2));
      let dir = p5.Vector.sub(pos1,pos2);

      let realForce = dir.normalize().mult(force).mult(ratio);
      cirle1.applyForce(realForce);
      cirle2.applyForce(realForce.mult(-1));
    }
  }

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

    //加入摩擦力，大小和质量成正比，方向和运动方向相反
    if(balloon.in(0,0,100,600)){
      let vel2 = balloon.getVel();
      let friction = vel2.copy().mult(-1).normalize().mult(balloon.getM()).mult(-1);
      balloon.applyForce(friction);
    }

    //加速区域，和摩擦力相反
    if(balloon.in(200,0,100,600)){
      let vel2 = balloon.getVel();
      let frictionRev = vel2.copy().mult(-1).normalize().mult(balloon.getM()).mult(18);
      balloon.applyForce(frictionRev);
    }

    //加入流体阻力，大小和速度的平方成正比，方向和运动方向相反
    if(balloon.in(400,0,100,600)){
      let vel2 = balloon.getVel();
      let friction = vel2.copy().normalize().mult(Math.pow(vel2.mag(),2)).mult(1).mult(5);
      balloon.applyForce(friction);
    }

    //加入引力和斥力 (g * m * M) / (r * r)
    for(let j = 0;j < 2;j ++){
      let att = attractionCircles[j];
      let revDir = att.getIsReverse() ? 1 : -1;
      let pos = att.getPos();
      let M = att.getM();
      let ratio = 36;

      let m = balloon.getM();
      let pos2 = balloon.getPos();

      let force = (M * m) / (p5.Vector.dist(pos,pos2));
      let dir = p5.Vector.sub(pos,pos2);

      balloon.applyForce(dir.normalize().mult(force).mult(revDir).mult(ratio));
    }

    balloon.applyForce(wind);

    balloon.applyForce(gravity);

    //浮力(向上 和面积成正比)
    // let floatForce = createVector(0,balloonSize * balloonSize * 0.01);
    
    //浮力(向上)
    let floatForce = createVector(0,15);

    balloon.applyForce(floatForce);

    //空气阻力(和运动方向相反，大小和速度成正比)
    let vel = balloon.getVel();
    let airForce = vel.copy().mult(-1).normalize().mult(0.1);
    balloon.applyForce(airForce);

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
