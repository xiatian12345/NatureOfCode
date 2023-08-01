function Serbinski(arr){
  let pos1 = arr[0][0];
  let pos2 = arr[0][1];
  let pos3 = arr[0][2];

  let dist = p5.Vector.dist(pos1,pos2);
  let newArr = [];
  if(dist > 10){
    for(let i = 0;i < arr.length;i ++){
      let pos1 = arr[i][0];
      let pos2 = arr[i][1];
      let pos3 = arr[i][2];

      let p12c = p5.Vector.add(pos1,p5.Vector.sub(pos2,pos1).normalize().mult(dist/2));
      let p13c = p5.Vector.add(pos1,p5.Vector.sub(pos3,pos1).normalize().mult(dist/2));
      let p23c = p5.Vector.add(pos2,p5.Vector.sub(pos3,pos2).normalize().mult(dist/2));
      newArr.push([pos1,p12c,p13c],[p12c,pos2,p23c],[p13c,p23c,pos3]);
    }
    Serbinski(newArr);
  }else{
    fill(255,0,0,100);
    beginShape(TRIANGLES);//TRIANGLES
    for(let i = 0;i < arr.length;i ++){
      let pos1 = arr[i][0];
      let pos2 = arr[i][1];
      let pos3 = arr[i][2];
      vertex(pos1.x,pos1.y);
      vertex(pos2.x,pos2.y);
      vertex(pos3.x,pos3.y);
    }
    endShape();
  }
}

function setup() {
  strokeWeight(0.01);
  createCanvas(windowHeight, windowHeight);

  let p1 = createVector(0,height);
  let p2 = createVector(width,height);
  let dist = p5.Vector.dist(p1,p2);
  let norm = p5.Vector.sub(p2,p1).normalize();
  let p3 = p5.Vector.add(p1,norm.rotate(-1/3*Math.PI).mult(dist));
  Serbinski([[p1,p2,p3]]);
}

function draw() {

}
