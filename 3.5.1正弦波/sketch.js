let step = 0.1;
let stargAngle = 0;
let len = 150;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(5);
}

function draw() {
  background('white');

  beginShape();
    stroke('red');
    for(let i = 0; i < width;i += step){
      stargAngle += 0.1;
      let x = i * len;
      let y = Math.sin(stargAngle) * len + height/2;
      vertex(x, y)
    }
  endShape();

  stroke('green');
  line(width/2,0,width/2,height);
  line(0,height/2,width,height/2);
}
