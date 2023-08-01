function drawKoch(arr){
  let pos1 = arr[0][0];
  let pos2 = arr[0][1];
  let dist = p5.Vector.dist(pos1,pos2);
  let newArr = [];
  if(dist > 6){
    for(let i = 0;i < arr.length;i ++){
      let pos1 = arr[i][0];
      let pos2 = arr[i][1];

      let dir = p5.Vector.sub(pos2,pos1);
      let dirNormal = dir.copy().normalize();
      let dist = dir.mag();
      let p1R = p5.Vector.add(pos1,dirNormal.copy().mult(dist * 1/3));
      let p2L = p5.Vector.add(pos1,dirNormal.copy().mult(dist * 2/3));
      let p12C = p5.Vector.add(p1R,dirNormal.copy().rotate(-1*PI/3).mult(dist * 1/3));
      newArr.push([pos1,p1R]);
      newArr.push([p1R,p12C]);
      newArr.push([p12C,p2L]);
      newArr.push([p2L,pos2]);
    }
    drawKoch(newArr);
  }else{
    beginShape();
    for(let i = 0;i < arr.length;i ++){
      let pos1 = arr[i][0];
      let pos2 = arr[i][1];
      vertex(pos1.x,pos1.y);
      vertex(pos2.x,pos2.y);
    }
    endShape();
  }
}

function setup() {
  strokeWeight(0.01);
  createCanvas(windowWidth, windowHeight);
  drawKoch([[createVector(0,height/2+300),createVector(width,height/2+300)]]);
}

function draw() {

}
