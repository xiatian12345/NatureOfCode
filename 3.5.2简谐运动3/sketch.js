function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  frameRate(30);
  fill('green');
  stroke('green');
  strokeWeight(3);
}


let A = 400;
let w = 0.1;
let t = 0;
let phy = Math.PI;
/**
简谐运动公式
x(t) = A * cos(ωt + φ)
其中：
- x(t) 是时间 t 时刻的位移；
- A 是振幅，表示振动的最大位移；
- ω 是角频率，表示单位时间内的角度变化量，它与振动的周期 T 之间有关系：ω = 2π / T；
- t 是时间；
- φ 是相位常数，表示在 t = 0 时刻的相位。
 */
function draw() {
  background('white');
  
  t += 0.5;
  let x = A * Math.cos(w * t + phy);
  let y = 0;

  translate(width/2,height/2);
  circle(x,y,50);
  line(0,0,x,y);
}
