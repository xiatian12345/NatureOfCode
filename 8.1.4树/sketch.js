function tree(p1,p2,w){
  strokeWeight(w);
  line(p1.x,p1.y,p2.x,p2.y);

  let dist = p5.Vector.dist(p1,p2);

  if(dist > 1){
    let dir = p5.Vector.sub(p2,p1).normalize();
    let p3 = p5.Vector.add(p2,dir.copy().rotate(-1/6*Math.PI).mult(dist * 0.5));
    let p4 = p5.Vector.add(p2,dir.copy().rotate(1/6*Math.PI).mult(dist * 0.5));
  
    tree(p2,p3,w*0.8);
    tree(p2,p4,w*0.8);
  }
}

function setup() {
  strokeWeight(0.01);
  createCanvas(windowWidth, windowHeight);

  let p1 = createVector(width/2,height);
  let p2 = createVector(width/2,height/2);
  tree(p1,p2,5);
}

function draw() {

}
