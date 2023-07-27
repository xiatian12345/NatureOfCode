class Vehicle{
  constructor(pos,target,section){
    this.target = target;
    this.section = section;

    this.pos = pos.copy();
    this.vel = p5.Vector.random2D().mult(random(1,5));
    this.acc = createVector(0,0);

    this.angle = 0;

    this.size = 20;

    this.maxSpeed = carMaxSpeedSlider.value();
    this.maxForce = carMaxForceSlider.value();

    this.wanderFuturePos = null;
    this.wanderFutureTarget = null;
    this.wanderFutureSize = null;
  }

  resetPosition(pos){
    this.pos = pos || createVector(random(0,width),random(0,height));
    this.vel = p5.Vector.random2D().mult(this.vel.mag());
  }

  applyForce(force){
    this.acc.add(force);
  }

  //寻找行为（寻找给定的目标）
  seek(){
    let desiredVel = p5.Vector.sub(this.target.getPos(),this.pos);

    //到达行为
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

  //游走行为（寻找未来位置为圆心的圆上任意一点）
  wander(){
    let futurePosSize = 2 * this.size;//向前多少是未来的位置
    let wanderRandSize = 10 * this.size;//以多大为随机的位置
    //未来位置
    let delta = this.vel.copy().normalize().mult(futurePosSize);
    let futurePos = p5.Vector.add(this.pos,delta);
    this.wanderFuturePos = futurePos.copy();
    //未来圆上任意一点作为目标位置
    let targetPos = p5.Vector.add(futurePos,p5.Vector.random2D().mult(wanderRandSize/2));
    this.wanderFutureTarget = targetPos.copy();
    this.wanderFutureSize = wanderRandSize;

    //其余的和seek一样了
    let desiredVel = p5.Vector.sub(targetPos,this.pos);
    let steeringForce = p5.Vector.sub(desiredVel,this.vel);
    steeringForce = steeringForce.copy().normalize().mult(constrain(steeringForce.mag(),0,this.maxForce));
    this.applyForce(steeringForce);
  }

  update(){
    if(this.section.getIsSeeking()) this.seek();
    if(this.section.getIsWandering()) this.wander();
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


    if(this.section.getIsWandering()) {
      noFill();
      stroke(200,0,0,200);
      circle(this.wanderFutureTarget.x,this.wanderFutureTarget.y,3);//未来目标位置
      stroke(200,0,200);
      circle(this.wanderFuturePos.x,this.wanderFuturePos.y,6);//未来位置
      stroke(0,0,200,200);
      circle(this.wanderFuturePos.x,this.wanderFuturePos.y,this.wanderFutureSize);//未来圆
    }
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

class Section{
  constructor(){
    let seekingText = createP('seeking');
    seekingText.position(10,height/2-80);

    let wanderingText = createP('wandering');
    wanderingText.position(10,height-80);

    this.isSeeking = false;
    this.isWandering = false;
  }

  getIsWandering(){
    return this.isWandering;
  }

  getIsSeeking(){
    return this.isSeeking;
  }

  update(){
    if(mouseY > height/2){
      this.isSeeking = false;
      this.isWandering = true;
    }else{
      this.isSeeking = true;
      this.isWandering = false;
    }
  }

  display(){
    noStroke();
    fill(100,0,0,50);
    rect(0,0,width,height/2);
    fill(0,100,0,50);
    rect(0,height/2,width,height/2);
  }
}

let car = null;
let target = null;

let carMaxSpeedSlider = null;
let carMaxForceSlider = null;
let targetLimitRSlider = null;

let section = null;

function setup() {
  createCanvas(windowWidth, windowHeight);

  let maxSpeedText = createP('Max Speed');
  maxSpeedText.position(10,100-5);
  carMaxSpeedSlider = createSlider(0.1,20,5,0.1);
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

  section = new Section();
  target = new Target(createVector(width/2,height/2),10);
  car = new Vehicle(createVector(random(0,width),random(0,height)),target,section);
}

function keyPressed(e){
  if(e.key === 'ArrowUp'){
    car.resetPosition(createVector(random(0,width),random(0,height/2)));
  }else if(e.key === 'ArrowDown'){
    car.resetPosition(createVector(random(0,width),random(height/2,height)));
  }
}

function draw() {
  background(255);
  section.update();
  section.display();

  car.maxSpeed = carMaxSpeedSlider.value();
  car.maxForce = carMaxForceSlider.value();
  target.limitR = targetLimitRSlider.value();
  
  target.update();
  target.display();

  car.update();
  car.display();
}
