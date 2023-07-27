class Arrow{
  constructor(pos,len,angle){
    this.pos = pos.copy();
    this.len = len;
    this.angle = angle;

    this.isChosed = false;

    this.perlinX = 0;
    this.perlinY = 1;
  }

  update(){
    push();
      translate(this.pos.x,this.pos.y);
      rotate(this.angle);
      let p1 = createVector(1,0).mult(this.len/2);
      let p2 = createVector(1,0).mult(-this.len/2);
      strokeCap(ROUND);
      strokeJoin(ROUND);
      if(this.isChosed){
        strokeWeight(10);
      }else{
        strokeWeight(2);
      }
      stroke(0,100,0,100);
      line(p1.x,p1.y,p2.x,p2.y);

      let d = 12;
      let lAng = Math.PI - Math.PI/20;
      push();
        translate(p1.x,p1.y);
        rotate(lAng);
        line(0,0,d,0);
      pop();
      push();
        translate(p1.x,p1.y);
        rotate(-lAng);
        line(0,0,d,0);
      pop();
    pop();
  }

  setAngle(angle){
    this.angle = angle;
  }

  getAngle(){
    return this.angle;
  }

  getPos(){
    return this.pos.copy();
  }
}

class Flow{
  constructor(cellSize){
    this.width = width;
    this.height = height;

    this.cellSize = cellSize;
    this.rows = Math.ceil(this.height/this.cellSize);
    this.cols = Math.ceil(this.width/this.cellSize);
    this.arrows = [];
    this.createArrows();
    this.drawGrid();
  }

  createArrows(){
    let deltaXY = this.cellSize/2;

    for(let i = 0;i < this.rows;i ++){
      let arr = [];
      for(let j = 0;j < this.cols;j ++){
        let arrow = new Arrow(createVector(j * this.cellSize+deltaXY,i * this.cellSize+deltaXY),this.cellSize,random(0,Math.PI * 2));
        arr.push(arrow);
      }
      this.arrows.push(arr);
    }
  }

  drawGrid(){
    noFill();
    stroke(255,30,30,240);
    for(let i = 0;i < this.cols;i ++){
      line(i * this.cellSize,0,i * this.cellSize,this.height);
    }
    for(let i = 0;i < this.rows;i ++){
      line(0,i * this.cellSize,this.width,i * this.cellSize);
    }
  }

  getArrowAngle(x,y){
    let arrow = this.getArrow(x,y);
    return arrow ? arrow.getAngle() : -Infinity;
  }

  getArrow(x,y){
    let i = 0;
    let j = 0;
    j = Math.floor(x / this.cellSize);
    i = Math.floor(y / this.cellSize);
    if(!this.arrows[i] || !this.arrows[i][j]) return null;
    return this.arrows[i][j];
  }

  effectByMouse(){
    let mousePos = createVector(mouseX,mouseY);
    for(let i = 0;i < this.rows;i ++){
      for(let j = 0;j < this.cols;j ++){
        let arrow = this.arrows[i][j];
        let angle = p5.Vector.sub(mousePos,arrow.getPos());
        arrow.setAngle(angle.heading());
      }
    }
  }

  effectByPerlinNoise(){
    let xoff = 0;
    for(let i = 0;i < this.rows;i ++){
      let yoff = 0;
      xoff += 0.02;
      for(let j = 0;j < this.cols;j ++){
        yoff += 0.02;
        let zoff = frameCount * 0.02;
        let rand = noise(xoff,yoff,zoff);
        let angle = map(rand,0,1,0,Math.PI*2);
        let arrow = this.arrows[i][j];
        arrow.setAngle(angle);
      }
    }
  }


  update(){
    for(let i = 0;i < this.rows;i ++){
      for(let j = 0;j < this.cols;j ++){
        let arrow = this.arrows[i][j];
        arrow.update();
      }
    }
  }

  display(){

  }
}

class Vehicle{
  constructor(pos,flow){
    this.flow = flow;

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

  //寻找目标
  seek(){
    let arrow = this.flow.getArrow(this.pos.x,this.pos.y);
    if(!arrow)  return;//屏幕外面没有需要到达的路径了
    let angle = arrow.getAngle();
    let steeringForce = p5.Vector.fromAngle(angle);
    this.applyForce(steeringForce);
  }

  update(){
    this.seek();
    //标准的欧拉积分
    this.vel.add(this.acc);
    this.vel = this.vel.copy().normalize().mult(constrain(this.vel.mag(),0,this.maxSpeed));
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.angle = this.vel.heading();
    this.checkEdge();
  }

  checkEdge(){
    if(this.pos.x > width)  this.pos.x = 0;
    if(this.pos.x < 0)  this.pos.x = width;
    if(this.pos.y > height)  this.pos.y = 0;
    if(this.pos.y < 0)  this.pos.y = height;
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



let flow;

let cars = [];
let carCount = 20;

let carMaxSpeedSlider = null;
let carMaxForceSlider = null;

function setup() {
  createCanvas(windowWidth,windowHeight);

  let maxSpeedText = createP('Max Speed');
  maxSpeedText.position(10,100-5);
  carMaxSpeedSlider = createSlider(0.1,30,10,0.1);
  carMaxSpeedSlider.position(100,100);

  let maxForceText = createP('Max Force');
  maxForceText.position(10,200-5);
  carMaxForceSlider = createSlider(0.05,1,0.2,0.1);
  carMaxForceSlider.position(100,200);


  flow = new Flow(30);
  for(let i = 0;i < carCount;i ++){
    let car = new Vehicle(createVector(random(0,width),random(0,height)),flow);
    cars.push(car);
  }
}

function draw() {
  background(255);

  flow.effectByPerlinNoise();
  flow.update();
  flow.display();

  for(let i = 0;i < carCount;i ++){
    let car = cars[i];
    car.maxSpeed = carMaxSpeedSlider.value();
    car.maxForce = carMaxForceSlider.value();
    car.update();
    car.display();
  }
}