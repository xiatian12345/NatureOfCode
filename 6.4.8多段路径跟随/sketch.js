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

//判断某个点是否在两个点所连的线段上(不包括延长线)
// 设 点Q=(x,y),P1=(x1,y1),P2=(x2,y2) 线段P1P2 
// 判断 Q 在 P1P2上 的条件 必须同时满足 如下两点
// 	1 Q 在 P1P2 所在的 直线上
// 	2 Q 不在 P1P2的 延长或反向 延长线上
// 根据 叉乘 可以解决 问题1 ----> 判断 "(Q-P1)x(Q-P2)=0" 是否成立即可
// 根据 Q 是否处于 P1P2 所在的 BoundingBox 内即可----> 判断 "(min(x1,x2) <= x <= max(x1,x2)) && (min(y1,y2) <= y <= max(y1,y2))" 是否成立即可
Util.pointOnLine = function(startPos,endPos,centerPos){
  let crossDotIsZero = p5.Vector.sub(centerPos,startPos).cross(p5.Vector.sub(centerPos,endPos)).mag() < 0.0001;
  let x1 = startPos.x;
  let x2 = endPos.x;
  let y1 = startPos.y;
  let y2 = endPos.y;
  let x = centerPos.x;
  let y = centerPos.y;
  let inInBoundingBox = (Math.min(x1,x2) <= x && x <= Math.max(x1,x2)) && (Math.min(y1,y2) <= y && y <= Math.max(y1,y2));
  return crossDotIsZero && inInBoundingBox;
}

class Vehicle{
  constructor(pos,paths){
    this.paths = paths;
    this.path = this.paths[0];

    this.pos = pos.copy();
    this.vel = p5.Vector.random2D().mult(random(1,5));
    this.acc = createVector(0,0);

    this.angle = 0;
    this.size = 20;
    this.frameCount = 0;

    this.maxSpeed = 2;
    this.maxForce = 0.2;
  }

  resetPosition(pos){
    if(pos) {
      this.pos = pos.copy();
    }else{
      this.pos = createVector(random(0,width),random(0,height));
    }
  }

  applyForce(force){
    this.acc.add(force);
  }

  getNextPath(path){
    let index = 0;
    for(let i = 0;i < this.paths.length;i ++){
      let p = this.paths[i];
      if(p === path){
        index = i + 1;
      }
    }
    return this.paths[index % this.paths.length];
  }

  getPathIndex(path){
    let index = 0;
    for(let i = 0;i < this.paths.length;i ++){
      let p = this.paths[i];
      if(p === path){
        index = i;
      }
    }
    return index;
  }

  //路径跟随,这个多段路径跟随算法不是nature of code上的正统算法,这里是让一条路径一条路径接着走
  pathFollow(){
    //预测的半径
    const predictR = this.size / 2;
    //预测小车的位置
    const predictPos = p5.Vector.add(this.pos,this.vel.copy().mult(predictR));
    //hack写法
    this.frameCount ++;

    let normalPoint = Util.getNormalPoint(this.path.getStartPos(),this.path.getEndPos(),predictPos);
    if(!Util.pointOnLine(this.path.getStartPos(),this.path.getEndPos(),normalPoint) && this.frameCount > 100){
      console.log('当前路径走完,当前index = ',this.getPathIndex(this.path));
      this.path = this.getNextPath(this.path);
      console.log('下段路径index = ',this.getPathIndex(this.path));
      this.frameCount = 0;
    }
 
    for(let i = 0;i < this.paths.length;i ++){
      this.paths[i].setIsSelect(this.paths[i] === this.path);
    }

    //求出预测点和path的法线交点
    const normalPos = Util.getNormalPoint(this.path.getStartPos(),this.path.getEndPos(),predictPos);
    fill(0,255,0,255);
    circle(normalPos.x,normalPos.y,3);
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

    this.showCircle = true;

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

  setIsSelect(isSelect){
    this.isSelect = isSelect;
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
    if(this.isSelect) {
      stroke(255,0,0,255);
    }else{
      stroke(128,128,128,255);
    }
    line(this.line1StartPosition.x,this.line1StartPosition.y,this.line1EndPosition.x,this.line1EndPosition.y);
    line(this.line2StartPosition.x,this.line2StartPosition.y,this.line2EndPosition.x,this.line2EndPosition.y);
    //两个点
    strokeWeight(12);
    stroke('red');
    point(this.startPos.x,this.startPos.y);
    stroke('blue');
    point(this.endPos.x,this.endPos.y);
    if(this.showCircle){
      //两个半圆
      strokeWeight(2);
      stroke(128,128,128,255);
      noFill();
      arc(this.startPos.x,this.startPos.y,this.r*2,this.r*2,this.pathDirAngle+Math.PI/2,this.pathDirAngle+Math.PI/2+Math.PI);
      arc(this.endPos.x,this.endPos.y,this.r*2,this.r*2,this.pathDirAngle-Math.PI/2,this.pathDirAngle-Math.PI/2+Math.PI);
    }
  }
}

let car = null;
let pathPosArray = [];
let paths = [];

function setup() {
  createCanvas(windowWidth, windowHeight);

  pathPosArray = [
    createVector(100,100),
    createVector(300,300),
    createVector(500,200),
    createVector(700,200),
    createVector(800,500),
    createVector(1000,500),
    createVector(1300,300),
    createVector(1100,100),
    createVector(1500,200),
    createVector(1700,100),
    createVector(1700,500),
    createVector(1600,500),
    createVector(1600,800),
    createVector(1700,800),
    createVector(1700,1000),
    createVector(1500,1000),
    createVector(1500,800),
    createVector(900,800),
    createVector(300,600),
    createVector(400,1000),
    createVector(100,1000),
    createVector(100,100),
  ];
  let r = 10;
  for(let i = 0;i < pathPosArray.length - 1;i ++){
    let s = pathPosArray[i];
    let e = pathPosArray[i + 1];
    let path = new Path(s,e,r);
    paths.push(path);
  }

  car = new Vehicle(createVector(random(0,100),random(0,100)),paths);
}

function draw() {
  background(255);

  for(let i = 0;i < pathPosArray.length - 1;i ++){
    let start = pathPosArray[i];
    let end = pathPosArray[i + 1];
    line(start.x,start.y,end.x,end.y);
  }

  
  for(let i = 0;i < paths.length;i ++){
    let path = paths[i];
    path.update();
    path.display();
  }

  car.update();
  car.display();
}