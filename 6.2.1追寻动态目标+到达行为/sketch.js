class Vehicle{
  constructor(pos,target){
    this.target = target;

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
    let desiredVel = p5.Vector.sub(this.target.getPos(),this.pos);

    let limitR = this.target.getLimitR();
    let dist = p5.Vector.dist(this.target.getPos(),this.pos);
    let speed;
    if(dist < limitR){
      //map 速度为0到最大速度
      speed = map(dist,0,limitR,0,this.maxSpeed);
    }else{
      //限制 最大速度
      speed = this.maxSpeed;
    }
    desiredVel = desiredVel.copy().normalize().mult(speed);

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
  }

  display(){
    push();
      translate(this.pos.x,this.pos.y);
      rotate(this.angle);

      noStroke();
      fill(0,255,0,200);
      circle(0,0,this.size);

      if(p5.Vector.dist(this.pos,this.target.getPos()) > 2){
        noStroke();
        fill(0,0,255,250);
        circle(this.size/2,0,this.size/2);
      }
    pop();
  }
}

class Target{
  constructor(pos,size){
    this.pos = pos.copy();
    this.size = size;
    this.limitR = targetLimitRSlider.value();
  }

  getLimitR(){
    return this.limitR;
  }

  getPos(){
    return this.pos.copy();
  }

  update(){
    this.pos.set(mouseX,mouseY);
  }

  display(){
    noStroke();
    fill(128,128,128,255);
    circle(this.pos.x,this.pos.y,this.size);

    noFill();
    stroke(255,0,0,200);
    circle(this.pos.x,this.pos.y,this.limitR);
  }
}

let car = null;
let target = null;

let carMaxSpeedSlider = null;
let carMaxForceSlider = null;
let targetLimitRSlider = null;

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

  let targetLimitRText = createP('Tar LimitR');
  targetLimitRText.position(10,250-5);
  targetLimitRSlider = createSlider(50,300,100,0.1);
  targetLimitRSlider.position(100,250);

  let button = createButton('Reset Position');
  button.position(100, 150);
  button.mousePressed(()=>{
    car.resetPosition();
  });


  target = new Target(createVector(width/2,height/2),10);
  car = new Vehicle(createVector(random(0,width),random(0,height)),target);
}

function draw() {
  background(255);

  car.maxSpeed = carMaxSpeedSlider.value();
  car.maxForce = carMaxForceSlider.value();
  target.limitR = targetLimitRSlider.value();
  
  target.update();
  target.display();

  car.update();
  car.display();
}
