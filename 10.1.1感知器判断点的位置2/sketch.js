class Perceptron{
  constructor(){
    this.trainCount = 0;
    //感知器由wx,wy,wb三个输入权重构成
    this.initWeights();
    //学习常数
    this.learnRate = 0.01;
  }

  initWeights(){
    let wx = random(-1,1);
    let wy = random(-1,1);
    let wb = random(-1,1);
    this.weights = [wx,wy,wb];
  }

  //输出
  output(inputs){
    let sum = 0;
    for(let i = 0;i < this.weights.length;i ++){
      sum += this.weights[i] * inputs[i];
    }

    return this.active(sum);
  }

  //激活函数
  active(sum){
    if(sum > 0){
      return 1
    }else{
      return -1;
    }
  }

  display(){
    stroke(0,200,0,200);
    fill(100,100,100,200);
    strokeWeight(2);
    text(`点击鼠标开始预测`,0,-40);
    text(`训练次数:${this.trainCount}`,0,-20);
    text(`wx:${this.weights[0].toFixed(2)},wy:${this.weights[1].toFixed(2)},wb:${this.weights[2].toFixed(2)}`,0,0);
  }

  //训练
  train(inputs,answer){
    this.trainCount ++;
    //猜测答案
    let guess = this.output(inputs);
    //计算误差
    let error = answer - guess;
    //更新weights
    for(let i = 0;i < this.weights.length; i++){
      let oldWeight = this.weights[i];
      let newWeight = oldWeight + error * inputs[i] * this.learnRate;
      this.weights[i] = newWeight;
    }
  }
}

class Trainer{
  constructor(point,targetLine){
    let x = point.x;
    let y = point.y;
    let answer = point.judge(targetLine);
    this.inputs = [x,y,1];//偏置输入等于1
    this.answer = answer;
  }
}

class TargetLine{
  constructor(k,b){//y = kx + b
    this.k = k;
    this.b = b;
  }

  getY(x){//获取直线上的点y的坐标
    let r = this.k * x + this.b;
    return r * -1;//由于p5和笛卡尔坐标y相反
  }

  judge(x,y){//判断点位于本直线的哪边
    let getY = this.getY(x);
    if(y < getY)  {//在直线下方
      return -1;
    }else{
      return 1;
    }
  }

  display(){
    let x1 = -width/2;
    let x2 = width/2;
    let y1 = this.getY(x1);
    let y2 = this.getY(x2);

    strokeWeight(0.5);
    stroke(0,200,0,255);
    // translate(width/2,height/2);
    line(x1,y1,x2,y2);
  }
}

class Coordinate{
  constructor(){

  }

  display(){
    strokeWeight(0.1);
    stroke(100);
    translate(width/2,height/2);
    line(-width/2,0,width/2,0);
    line(0,-height/2,0,height/2);
  }
}

class Point{
  constructor(x,y){
    this.c = color(100,100,100,255);
    this.rc = color(200,0,0,255);
    this.bc = color(0,0,200,255);
    this.cIndex = 0;

    this.isMouse = false;

    this.size = 1;
    this.x = x;
    this.y = y;
  }

  judge(targetLine){
    return targetLine.judge(this.x,this.y);
  }

  setCIndex(index){
    this.cIndex = index;
  }

  display(){
    if(1 === this.cIndex){
      fill(this.bc);
    }else if(-1 === this.cIndex){
      fill(this.rc);
    }else if(0 === this.cIndex){
      fill(this.c);
    }else{
      fill(color(random(0,255),random(0,255),random(0,255),255));
    }

    if(this.isMouse){
      this.size = 10;
    }

    noStroke();
    circle(this.x,this.y,this.size);
  }
}

let coordinate;
let targetLine;
let points = [];
let pointsLen = 1000;
let perceptron;
let mousePoint = null;
function setup() {
  createCanvas(800, 600);
  coordinate = new Coordinate();
  targetLine = new TargetLine(3,100);
  perceptron = new Perceptron();

  for(let i = 0;i < pointsLen;i ++){
    let x = random(-width/2,width/2);
    let y = random(-height/2,height/2);
    let p = new Point(x,y);
    points.push(p);
  }
}

function draw() {
  background(200);
  coordinate.display();
  targetLine.display();
  perceptron.display();
  if(mousePoint)  mousePoint.display();

  for(let i = 0;i < pointsLen;i ++){
    let p = points[i];
    p.setCIndex(p.judge(targetLine));
    p.display();
  }
}

function mousePressed(){
  mousePoint = new Point(mouseX-width/2,mouseY-height/2);
  mousePoint.isMouse = true;

  let trainer = new Trainer(mousePoint,targetLine);
  let out = perceptron.output(trainer.inputs);
  mousePoint.cIndex = out;
}

function mouseReleased(){
  mousePoint = null;
}
