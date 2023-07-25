class Box{
  constructor(pos){
    this.pos = pos.copy();
  }

  update(){

  }

  display(){
    strokeWeight(2);
    stroke('red');
    noFill();
    rect(this.pos.x,this.pos.y,20,20);
  }
}

let boxs = [];
function setup() {
  createCanvas(800, 600);
  background('DodgerBlue');
}

function draw() {
  if(mouseIsPressed){
    boxs.push(new Box(createVector(mouseX,mouseY)));
  }
  for(let i = 0;i < boxs.length;i ++){
    boxs[i].display();
  }
}
