class Seed{
  constructor(pos){
    this.acc = createVector(0,0);
    this.vel = createVector(0,0);
    this.pos = pos.copy();
    this.initPos = pos.copy();

    this.accAngle = 0;
    this.velAngle = 0;
    this.angle = 0;

    this.m = 10;
    this.size = 30;

    this.isDead = false;
  }

  display(){
    push();
      translate(this.pos.x,this.pos.y);
      rotate(this.angle);
      stroke(0,255,0,255);
      noFill();
      circle(0,0,this.size);
      stroke(0,0,255,255);
      line(0,0,this.size/2,0);
    pop();
  }

  applyForce(force){
    this.acc.add(force);
    this.acc.mult(0.1);//乘以一个系数

    this.accAngle += force.mag();
  }

  update(){
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.velAngle += this.accAngle;
    this.angle += this.velAngle;
    this.accAngle = 0;

    if(this.pos.y > height) this.isDead = true;
  }
}

class BigGun{
  constructor(pos){
    this.w = 300;
    this.h = 30;
    this.pos = pos.copy();

    this.seeds = [];
    this.currentSeed = null;
  }

  update(){
    for(let i = 0;i < this.seeds.length; i++){
      let seed = this.seeds[i];
      if(seed.isDead) continue;
      if((seed.pos.x < this.pos.x) || (seed.pos.x > this.pos.x + this.w)){
        //施加重力
        let g = createVector(0,10);
        seed.applyForce(g);
      }
    }
  }

  display(){
    //gun display
    stroke(255,0,0,155);
    noFill();
    rect(this.pos.x,this.pos.y,this.w,this.h);

    //seed display
    for(let i = 0;i < this.seeds.length; i++){
      let seed = this.seeds[i];
      if(seed.isDead) continue;
      seed.update();
      seed.display();
    }

    //current seed
    if(this.currentSeed){
      this.currentSeed.update();
      this.currentSeed.display();
    }
  }

  createSeed(){
    this.currentSeed = new Seed(createVector(this.pos.x,this.pos.y+this.h/2));
  }

  fire(force){
    const seed = this.currentSeed;
    this.seeds.push(seed);
    seed.applyForce(force);

    this.currentSeed = null;
  }
}


function mousePressed(){
  time = 0;
  startTime = true;
  endTime = false;
  showSeed = true;
}
function mouseReleased(){
  startTime = false;
  endTime = true;
}

let bigGun = null;
let time = 0;
let startTime = false;
let endTime = false;
let showSeed = false;
let slider = null;


function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  background('DodgerBlue');
  strokeWeight(2);

  bigGun = new BigGun(createVector(10,height/3*1));

  slider = createSlider(0, 3000, 0,1);
  slider.position(0, height/2);
  slider.style('width', '310px');
}

function draw() {
  background('DodgerBlue');
  if(showSeed){
    showSeed = false;
    bigGun.createSeed();
  }

  if(startTime){
    time += 10;
    slider.value(time);
  }
  if(endTime){
    endTime = false;
    bigGun.fire(createVector(time,0));
    time = 0;
    slider.value(time);
  }

  bigGun.update();
  bigGun.display();
}
