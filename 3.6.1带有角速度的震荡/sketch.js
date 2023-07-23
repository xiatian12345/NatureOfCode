class Oscillator {
  constructor() {
    //角加速度------加速度
    this.accAngle = createVector(random(-0.1, 0.1), random(-0.1, 0.1));
    //角速度--------速度
    this.velAngle = createVector(0,0);
    //角度----------位移
    this.angle = createVector(0,0);
    //振幅
    this.amplitude = createVector(random(150, width / 2), random(150, height / 2));
  }

  update() {
    //更新三件套
    this.velAngle.add(this.accAngle);
    this.angle.add(this.velAngle);
    this.accAngle.mult(0);
  }

  display() {
    let x = sin(this.angle.x) * this.amplitude.x;
    let y = sin(this.angle.y) * this.amplitude.y;

    push();
      translate(width / 2, height / 2);
      stroke('green');
      line(0, 0, x, y);
      fill('green');
      circle(x, y, 60);
    pop();
  }
}

let oscillator = null;
function setup() {
  createCanvas(window.innerWidth,window.innerHeight);
  oscillator = new Oscillator();
}


function draw() {
  background('white');
  oscillator.update();
  oscillator.display();
}
