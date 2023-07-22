function setup() {
  createCanvas(800, 600);
  background('DodgerBlue');
  rectMode(CENTER);
}

function draw() {
  background('DodgerBlue');

  push();//为了不对其他元素产生影响
    translate(width/2,height/2);
    rotate(frameCount / 60);

    fill('red');
    noStroke();
    circle(50,0,50);
    circle(-100,0,25);
    stroke('red');
    line(50,0,-100,0);
  pop();

  // circle(0,0,100);
}
