function setup() {
  createCanvas(window.innerWidth,window.innerHeight);
  background('#777777');
  noStroke();
}

function draw() {
  translate(width/2,height/2);
  let rand = Math.floor(randomGaussian(0,200));

  let angle = random(0,Math.PI * 2);
  let y = rand * Math.sin(angle);
  let x = rand * Math.cos(angle);
  let val = map(Math.abs(rand),0,500,255,50);
  // fill(val,0,0,20);
  fill(random(0,255),random(0,255),random(0,255),180);
  circle(x,y,50);
}
