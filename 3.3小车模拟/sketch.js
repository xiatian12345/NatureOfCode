class Car{
  constructor(pos){
    this.pos = pos.copy();

    this.w = 240;
    this.h = 40;
    this.wheelR = 20;
    this.shellHeight = 30;

    this.isFronting = false;
    this.isBacking = false;

    this.m = 10;

    this.vel = createVector(0,0);
    this.acc = createVector(0,0);

    this.velAngle = 0;
    this.accAngle = 0;
    this.wheelAngle = 0;

    this.accessFloor = false;
  }

  applyForce(force){
    this.acc.add(force);
  }

  update(){
    if(this.isFronting){
      let force = createVector(10,0).mult(0.03).mult(1);
      this.applyForce(force);
    }
    if(this.isBacking){
      let force = createVector(10,0).mult(0.03).mult(-1);
      this.applyForce(force);
    }
    //摩擦力
    this.applyForce(this.vel.copy().normalize().mult(-1).mult(this.m).mult(0.008));
    //重力
    this.applyForce(createVector(0,10).mult(0.1));

    //碰到地板
    if((this.pos.y > height - 80) && !this.accessFloor){
      this.accessFloor = true;
      this.vel.mult(0)
      this.acc.mult(0);
    }
    if(this.accessFloor){
      this.applyForce(createVector(0,-10).mult(0.1));
    }

    if(this.isFronting){
      this.accAngle += this.acc.mag()*0.01;
    }else if(this.isBacking){
      this.accAngle += this.acc.mag()*0.01*(-1);
    }else{
      //用角速度变化来模拟摩擦力的影响
      this.accAngle = 0;
      this.velAngle *= 0.98;
    }


    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    this.velAngle += this.accAngle;
    this.wheelAngle += this.velAngle;
    this.accAngle = 0;
  }

  display(){
    noFill();
    stroke(0,255,0,255);

    push();
      translate(this.pos.x,this.pos.y);

      //车身
      rect(-this.w/2,-this.h/2,this.w,this.h);

      // //轮子
      // circle(-this.w/2 + 2*this.wheelR,this.h/2,this.wheelR*2);
      // line(-this.w/2 + 2*this.wheelR,this.h/2,-this.w/2 + 2*this.wheelR,this.h/2+this.wheelR);
      // circle(this.w/2 - 2*this.wheelR,this.h/2,this.wheelR*2);
      // line(this.w/2 - 2*this.wheelR,this.h/2,this.w/2 - 2*this.wheelR,this.h/2+this.wheelR);
      //轮子
      push();
        translate(-this.w/2 + 2*this.wheelR,this.h/2);
        rotate(this.wheelAngle);
        circle(0,0,this.wheelR*2);
        line(0,0,0,this.wheelR);
      pop();


      push();
        translate(this.w/2 - 2*this.wheelR,this.h/2);
        rotate(this.wheelAngle);
        circle(0,0,this.wheelR*2);
        line(0,0,0,this.wheelR);
      pop();

      //车顶
      quad(
        this.w/2 - 4*this.wheelR, 
        -this.h/2 - this.shellHeight, 

        -this.w/2 + 4*this.wheelR, 
        -this.h/2 - this.shellHeight, 

        -this.w/2 + 1*this.wheelR, 
        -this.h/2, 

        this.w/2 - 1*this.wheelR, 
        -this.h/2
        );
      //人
      circle(this.w/6,-this.shellHeight/2 - this.h/2+5,this.shellHeight/3*2);
    pop();
  }
}

function keyPressed(e){
  if(e.code === 'ArrowLeft' || e.code === 'ArrowRight'){
    e.code === 'ArrowLeft' ? (car.isBacking = true) : (car.isFronting = true);
  }
}

function keyReleased(e){
  if(e.code === 'ArrowLeft' || e.code === 'ArrowRight'){
    e.code === 'ArrowLeft' ? (car.isBacking = false) : (car.isFronting = false);
  }
}


let car = null;
function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  strokeWeight(2);
  car = new Car(createVector(width/2,height/2));
}

function draw() {
  background('white');
  stroke('red');
  line(0,height - 40,width,height - 40);
  car.update();
  car.display();
}
