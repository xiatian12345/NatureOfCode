class Util{

}
//求某个点到两个点所连线段的法线交点
Util.getNormalPoint = function(startPos,endPos,centerPos){
  let p = p5.Vector.sub(centerPos, startPos);
  let dir = p5.Vector.sub(endPos,startPos);
  dir.normalize();
  dir.mult(p.dot(dir));
  let normalPoint = p5.Vector.add(startPos, dir);
  return normalPoint;
}


class Vehicle{
  constructor(pos,path){
    this.path = path;

    this.pos = pos.copy();
    this.vel = p5.Vector.random2D().mult(random(1,5));
    this.acc = createVector(0,0);

    this.angle = 0;

    this.size = 20;

    this.maxSpeed = carMaxSpeedSlider.value();
    this.maxForce = carMaxForceSlider.value();
  }

  resetPosition(){
    this.pos = createVector(random(0,width),random(0,height));
  }

  applyForce(force){
    this.acc.add(force);
  }

  //路径跟随
  pathFollow(){
    //预测的半径
    const predictR = this.size * 2;
    //预测小车的位置
    const predictPos = p5.Vector.add(this.pos,this.vel.copy().mult(predictR));
    //求出预测点和path的法线交点
    const normalPos = Util.getNormalPoint(this.path.getStartPos(),this.path.getEndPos(),predictPos);
    const dist = p5.Vector.dist(predictPos,normalPos);
    let target = null;
    if(dist > this.path.getR()){
      //必须转向,转向的target位置是normalPos按照path方向向前的某个地方
      let r = this.size;
      target = p5.Vector.add(normalPos,this.path.getDir().normalize().mult(r));
    }else{
      //不用转向，seek到predictPos即可
      target = predictPos;
    }

    this.seek(target);
  }

  //寻找目标
  seek(targetPos){
    if(!targetPos)  return;
    let desiredVel = p5.Vector.sub(targetPos,this.pos);

    let steeringForce = p5.Vector.sub(desiredVel,this.vel);
    steeringForce = steeringForce.copy().normalize().mult(constrain(steeringForce.mag(),0,this.maxForce));

    this.applyForce(steeringForce);
  }

  update(){
    this.pathFollow();
    //标准的欧拉积分
    this.vel.add(this.acc);
    this.vel = this.vel.copy().normalize().mult(constrain(this.vel.mag(),0,this.maxSpeed));
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.angle = this.vel.heading();
  }

  display(){
    push();
      translate(this.pos.x,this.pos.y);
      rotate(this.angle);

      noStroke();
      fill(0,255,0,200);
      circle(0,0,this.size);

      noStroke();
      fill(0,0,255,250);
      circle(this.size/2,0,this.size/2);
    pop();
  }
}

class Path{
  constructor(startPos,endPos,r){
    this.startPos = startPos.copy();
    this.endPos = endPos.copy();
    this.r = r;

    //路径的距离
    this.pathDist = p5.Vector.dist(this.startPos,this.endPos);
    //路径的方向
    this.pathDir = p5.Vector.sub(this.endPos,this.startPos);
    //路径的方向角度
    this.pathDirAngle = this.pathDir.heading();
    //需要画的两条线的坐标
    let angle = this.pathDirAngle + Math.PI/2//在startPos和endPos所在的方向上旋转了90度
    let dir = p5.Vector.fromAngle(angle);
    let deltaPos = dir.mult(this.r);
    this.line1StartPosition = p5.Vector.add(this.startPos,deltaPos);
    this.line2StartPosition = p5.Vector.sub(this.startPos,deltaPos);

    this.line1EndPosition = p5.Vector.add(this.endPos,deltaPos);
    this.line2EndPosition = p5.Vector.sub(this.endPos,deltaPos);
  }

  getR(){
    return this.r;
  }

  getDist(){
    return this.pathDist;
  }

  getDir(){
    return this.pathDir.copy();
  }

  getDirAngle(){
    return this.pathDirAngle();
  }

  getStartPos(){
    return this.startPos.copy();
  }

  getEndPos(){
    return this.endPos.copy();
  }

  update(){

  }

  display(){
    //路线由两条线和两个半圆组成和两个点
    noFill();
    strokeWeight(2);
    stroke(128,128,128,255);
    line(this.line1StartPosition.x,this.line1StartPosition.y,this.line1EndPosition.x,this.line1EndPosition.y);
    line(this.line2StartPosition.x,this.line2StartPosition.y,this.line2EndPosition.x,this.line2EndPosition.y);
    //两个点
    strokeWeight(12);
    stroke('red');
    point(this.startPos.x,this.startPos.y);
    stroke('blue');
    point(this.endPos.x,this.endPos.y);
    //两个半圆
    strokeWeight(2);
    stroke(128,128,128,255);
    noFill();
    arc(this.startPos.x,this.startPos.y,this.r*2,this.r*2,this.pathDirAngle+Math.PI/2,this.pathDirAngle+Math.PI/2+Math.PI);
    arc(this.endPos.x,this.endPos.y,this.r*2,this.r*2,this.pathDirAngle-Math.PI/2,this.pathDirAngle-Math.PI/2+Math.PI);
  }
}

let car = null;
let path = null;

let carMaxSpeedSlider = null;
let carMaxForceSlider = null;

function setup() {
  createCanvas(windowWidth, windowHeight);

  let maxSpeedText = createP('Max Speed');
  maxSpeedText.position(10,100-5);
  carMaxSpeedSlider = createSlider(0.1,8,3,0.1);
  carMaxSpeedSlider.position(100,100);

  let maxForceText = createP('Max Force');
  maxForceText.position(10,200-5);
  carMaxForceSlider = createSlider(0.05,1,0.2,0.1);
  carMaxForceSlider.position(100,200);

  let button = createButton('Reset Position');
  button.position(100, 150);
  button.mousePressed(()=>{
    car.resetPosition();
  });


  path = new Path(createVector(200,300,),createVector(width-300,height-500),10);
  car = new Vehicle(createVector(random(0,width),random(0,height)),path);
}

function draw() {
  background(255);

  car.maxSpeed = carMaxSpeedSlider.value();
  car.maxForce = carMaxForceSlider.value();
  
  path.update();
  path.display();

  car.update();
  car.display();
}
