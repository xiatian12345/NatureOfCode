
function rotateHTML() {
  theta += 0.5;
  let d = theta + "deg";
  p5Canvas.style.transform = "rotate(" + d + ")";
}

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  strokeWeight(3);

  p5Canvas = document.getElementById("defaultCanvas0");
}

let angle = 0;
let step = 0.1;
let len = 600;
let theta = 0;
let p5Canvas = null;

function draw() {
  background('white');
  angle += step;
  let x = Math.sin(angle) * len + width/2;
  let y = height/2;
  stroke('red');
  line(width/2,height/2,x,y);
  noStroke();
  fill('red');
  circle(x,y,80);

  rotateHTML();//旋转整个p5画布
}
