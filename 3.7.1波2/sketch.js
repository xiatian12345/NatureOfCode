class Wave{
  constructor(amplitude,posY,w,phy,color){
    this.amplitude = amplitude;
    this.posY = posY;
    this.color = color;
    
    this.w = w;
    this.phy = phy;
    this.t = 0;
  }

  update(){
    for(let i = 0;i < width;i += span){
      this.t += 0.05;
      let angle = this.w * this.t + this.phy;
      let deltaY = this.amplitude * Math.sin(angle);
      let y = this.posY + deltaY;
      strokeWeight(1);
      stroke(this.color);
      circle(i,y,span/2);
    }
  }
}

class MergeWave{
  constructor(w1,w2,color){
    this.w1 = w1;
    this.w2 = w2;
    this.color = color;
    this.t = 0;
  }

  update(){
    for(let i = 0;i < width;i += span){
      this.t += 0.05;

      let angle = this.w1.w * this.t + this.w1.phy;
      let deltaY = this.w1.amplitude * Math.sin(angle);
      let y1 = this.w1.posY + deltaY;


      let angle2 = this.w2.w * this.t + this.w2.phy;
      let deltaY2 = this.w2.amplitude * Math.sin(angle2);
      let y2 = this.w2.posY + deltaY2;
      strokeWeight(4);
      stroke(this.color);
      circle(i,(y1 + y2)-(this.w1.amplitude + this.w2.amplitude)*2,span/2);
    }
  }

}

let span = 20;
let wave1 = null;
let wave2 = null;
let mergeWave = null;
function setup() {
  createCanvas(1200, 800);
  background(200);
  noFill();
  stroke(0,0,200,200);

  frameRate(5);
  wave1 = new Wave(100,height/2,Math.PI,Math.PI/2,color('green'));
  wave2 = new Wave(100,height/2,Math.PI*3,Math.PI,color('blue'));
  mergeWave = new MergeWave(wave1,wave2,'red');
}

function draw() {
  background(200);

  wave1.update();
  wave2.update();
  mergeWave.update();
}
