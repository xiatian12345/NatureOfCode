class Vehicle{
  constructor(pos){
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

  getVel(){
    return this.vel.copy();
  }

  getPosition(){
    return this.pos.copy();
  }

  applyForce(force){
    if(force)this.acc.add(force);
  }

  applyCluster(cars){
    let sepForce = this.separate(cars);
    this.applyForce(sepForce);

    let alignmentForce = this.alignment(cars);
    this.applyForce(alignmentForce);

    this.gather(cars);
  }

  //聚集
  gather(cars){
    let total = createVector();
    let count = 0;
    let distCondition = this.size * 3;//只和这个距离内的car有聚集关系

    for(let i = 0;i < cars.length;i ++){
      let car = cars[i];
      let carPos = car.getPosition();
      let distDir = p5.Vector.sub(this.getPosition(),car.getPosition());
      if(distDir.mag() < distCondition){
        total.add(carPos);
        count ++;
      }
    }
    if(count < 0) return;

    total.mult(0.4);
    this.seek(total);
  }

  //对齐
  alignment(cars){
    let total = createVector();
    let count = 0;
    let distCondition = this.size * 8;//只和这个距离内的car有对齐关系
    for(let i = 0;i < cars.length;i ++){
      let car = cars[i];
      let dir = car.getVel();
      let distDir = p5.Vector.sub(this.getPosition(),car.getPosition());
      if(distDir.mag() < distCondition){
        total.add(dir);
        count ++;
      }
    }
    if(count <= 0)  return;

    let avg = total.div(count);
    //所需速度
    let need = p5.Vector.sub(avg,this.vel);
    //限制到最大速度
    need = need.copy().normalize().mult(constrain(need.mag(),0,this.maxSpeed));
    return need;
  }

  //分离
  separate(cars){
    let distCondition = this.size * 4;//只和这个距离内的car有分离关系
    let total = createVector();
    for(let i = 0;i < cars.length;i ++){
      let car = cars[i];
      let dir = p5.Vector.sub(this.getPosition(),car.getPosition());
      if(dir.mag() <= distCondition){
        //距离越大，所需的分离程度越小
        total.add(dir).div(dir.mag());
      }
    }

    //限制到最大速度
    total = total.copy().normalize().mult(constrain(total.mag(),0,this.maxSpeed));
    return total;
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

let carCount = 40;
let cars = [];

let carMaxSpeedSlider = null;
let carMaxForceSlider = null;

function setup() {
  createCanvas(windowWidth, windowHeight);

  let maxSpeedText = createP('Max Speed');
  maxSpeedText.position(10,100-5);
  carMaxSpeedSlider = createSlider(0.1,30,10,0.1);
  carMaxSpeedSlider.position(100,100);

  let maxForceText = createP('Max Force');
  maxForceText.position(10,200-5);
  carMaxForceSlider = createSlider(0.05,1,0.2,0.1);
  carMaxForceSlider.position(100,200);


  for(let i = 0;i < carCount;i ++){
    let car = new Vehicle(createVector(random(0,width),random(0,height)));
    cars.push(car);
  }
}

function draw() {
  background(255);

  for(let i = 0;i < cars.length;i ++){
    let car = cars[i];

    car.maxSpeed = carMaxSpeedSlider.value();
    car.maxForce = carMaxForceSlider.value();

    car.applyCluster(cars);

    car.update();
    car.display();
  }
}

function mouseDragged(){
  let car = new Vehicle(createVector(mouseX,mouseY));
  cars.push(car);
}