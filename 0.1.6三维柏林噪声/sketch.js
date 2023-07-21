function setup() {
  createCanvas(600, 400);
  // background('DodgerBlue');
}

let z = 0;
function draw() {
  let x = 0;
  loadPixels();
  for(let i = 0;i < width;i ++){
    x += 0.05;
    let y = 3;
    for(let j = 0;j < height;j ++){
      y += 0.05;
      let c = noise(x,y,z);
      c = map(c,0,1,0,255);
      set(i,j,color(c,0,c,255));
    }
  }
  z += 0.03;

  updatePixels()
}
