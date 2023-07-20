let rectSize = 200;
let totalPoint = 1;
let circlePoint = 1;
let pi = (circlePoint/totalPoint) * 4;
let c = '';
//S正方形=rectSize * rectSize;
//S圆=pi * (rectSize/2) * (rectSize/2);
//S正方形/S圆 = 4pi;
let p = null;

function setup() {
  p = createP(`PI=${pi}`);
  p.style('font-size', '16px');
  p.style('color', 'red');
  p.position(window.innerWidth/2+rectSize/2, window.innerHeight/2-rectSize/2-30);

  createCanvas(window.innerWidth,window.innerHeight);
  rect(width/2 - rectSize/2,height/2-rectSize/2,rectSize,rectSize);
  circle(width/2,height/2,rectSize);

  console.log(p);
  noStroke();
}

function draw() {
  for(let i = 0;i < 30;i ++){
    let rand1 = random(-1 * rectSize/2,1 * rectSize/2);
    let rand2 = random(-1 * rectSize/2,1 * rectSize/2);
    if(Math.pow(rand1,2) + Math.pow(rand2,2) < Math.pow(rectSize/2,2)){//落入圆内
      c = 'red';
      circlePoint ++;
    }else{
      c = 'green';
    }
    totalPoint ++;
    fill(c);
    circle(width/2 + rand1,height/2 + rand2,2);
    pi = (circlePoint/totalPoint) * 4;
    p.html(`PI=${pi}`);
  }
}
