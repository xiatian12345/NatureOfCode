class Perceptron{
  constructor(){

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

    this.size = 2;
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

    noStroke();
    circle(this.x,this.y,this.size);
  }
}

let coordinate;
let targetLine;
let points = [];
let pointsLen = 1000;
function setup() {
  createCanvas(800, 600);
  coordinate = new Coordinate();
  targetLine = new TargetLine(3,100);

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

  for(let i = 0;i < pointsLen;i ++){
    let p = points[i];
    p.setCIndex(p.judge(targetLine));
    p.display();
  }
}
