class Arrow{
  constructor(pos,len,angle){
    this.pos = pos.copy();
    this.len = len;
    this.angle = angle;

    this.isChosed = false;

    this.perlinX = 0;
    this.perlinY = 1;
  }

  update(){
    push();
      translate(this.pos.x,this.pos.y);
      rotate(this.angle);
      let p1 = createVector(1,0).mult(this.len/2);
      let p2 = createVector(1,0).mult(-this.len/2);
      strokeCap(ROUND);
      strokeJoin(ROUND);
      if(this.isChosed){
        strokeWeight(10);
      }else{
        strokeWeight(2);
      }
      stroke(0,100,0,100);
      line(p1.x,p1.y,p2.x,p2.y);

      let d = 12;
      let lAng = Math.PI - Math.PI/20;
      push();
        translate(p1.x,p1.y);
        rotate(lAng);
        line(0,0,d,0);
      pop();
      push();
        translate(p1.x,p1.y);
        rotate(-lAng);
        line(0,0,d,0);
      pop();
    pop();
  }

  setAngle(angle){
    this.angle = angle;
  }

  getAngle(){
    return this.angle;
  }

  getPos(){
    return this.pos.copy();
  }
}

class Flow{
  constructor(cellSize){
    this.width = width;
    this.height = height;

    this.cellSize = cellSize;
    this.rows = Math.ceil(this.height/this.cellSize);
    this.cols = Math.ceil(this.width/this.cellSize);
    this.arrows = [];
    this.createArrows();
    this.drawGrid();
  }

  createArrows(){
    let deltaXY = this.cellSize/2;

    for(let i = 0;i < this.rows;i ++){
      let arr = [];
      for(let j = 0;j < this.cols;j ++){
        let arrow = new Arrow(createVector(j * this.cellSize+deltaXY,i * this.cellSize+deltaXY),this.cellSize,random(0,Math.PI * 2));
        arr.push(arrow);
      }
      this.arrows.push(arr);
    }
  }

  drawGrid(){
    noFill();
    stroke(255,30,30,240);
    for(let i = 0;i < this.cols;i ++){
      line(i * this.cellSize,0,i * this.cellSize,this.height);
    }
    for(let i = 0;i < this.rows;i ++){
      line(0,i * this.cellSize,this.width,i * this.cellSize);
    }
  }

  getArrowAngle(x,y){
    let arrow = this.getArrow(x,y);
    return arrow ? arrow.getAngle() : -Infinity;
  }

  getArrow(x,y){
    let i = 0;
    let j = 0;
    j = Math.floor(x / this.cellSize);
    i = Math.floor(y / this.cellSize);
    if(!this.arrows[i] || !this.arrows[i][j]) return null;
    return this.arrows[i][j];
  }

  update(){
    for(let i = 0;i < this.rows;i ++){
      for(let j = 0;j < this.cols;j ++){
        let arrow = this.arrows[i][j];
        arrow.update();
      }
    }
  }

  display(){

  }
}

let flow;
function setup() {
  createCanvas(windowWidth,windowHeight);
  flow = new Flow(30);
}

function draw() {
  background(255);
  flow.update();
  flow.display();
}

// function mousePressed(){
//   let arrow = flow.getArrow(mouseX,mouseY);
//   arrow.isChosed = true;
// }