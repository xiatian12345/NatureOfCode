function tree(p1,p2,w){
  strokeWeight(w);
  line(p1.x,p1.y,p2.x,p2.y);

  let dist = p5.Vector.dist(p1,p2);

  if(dist > 10){
    let dir = p5.Vector.sub(p2,p1).normalize();
    let rand1 = random(-1/3*Math.PI,-1/12*Math.PI);
    let rand2 = random(1/12*Math.PI,1/3*Math.PI);
    let rand3 = random(-1/12*Math.PI,1/12*Math.PI);

    let p3 = p5.Vector.add(p2,dir.copy().rotate(rand1).mult(dist * 0.6));
    let p4 = p5.Vector.add(p2,dir.copy().rotate(rand2).mult(dist * 0.6));
    let p55 = p5.Vector.add(p2,dir.copy().rotate(rand3).mult(dist * 0.75));
  
    tree(p2,p3,w*0.8);
    tree(p2,p4,w*0.8);
    if(Math.random(0,1) > 0.2)tree(p2,p55,w*0.8);
  }
}

function setup() {
  strokeWeight(0.01);
  createCanvas(windowWidth, windowHeight);

  let p1 = createVector(width/2,height);
  let p2 = createVector(width/2,2*height/3);
  tree(p1,p2,5);
}

function draw() {

}
