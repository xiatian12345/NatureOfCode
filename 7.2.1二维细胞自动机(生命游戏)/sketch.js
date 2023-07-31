class Cell{
  constructor(x,y,w,h,c){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;

    this.isSelect = false;
  }

  setC(c){
    this.c = c;
  }

  display(){
    noFill();
    stroke(30,30,30,180);
    rect(this.x,this.y,this.w,this.h);
    noStroke();
    fill(this.c,this.c,this.c,255);
    rect(this.x,this.y,this.w,this.h);

    if(this.isSelect){
      fill(0,255,0,255);
      rect(this.x,this.y,this.w,this.h);
    }
  }
}

class CA{
  constructor(cellSize,simulateInterval){
    this.cellSize = cellSize;
    this.simulateInterval = simulateInterval;

    this.rows = Math.floor(height/this.cellSize);
    this.cols = Math.floor(width/this.cellSize);

    this.cells = [];

    this.genLifes();
    this.genCells();
  }

  //获取邻居有多少个是活着的
  getNeighborsLife(x,y){
    let count = 0;
    for (let k = -1; k <= 1; k++) {
      for (let m = -1; m <= 1; m++) {
        count += this.lifes[x + k][y + m];
      }
    }
    count -= this.lifes[x][y];

    return count;
  }

  getLife(x,y){
    if(this.lifes[x]){
      if(this.lifes[x][y] == 0 || this.lifes[x][y] == 1){
        return this.lifes[x][y];
      }else{
        return -1;
      }
    }else{
      return -1;
    }
  }

  genLifes(){
    this.lifes = [];
    for(let i = 0;i < this.cols;i ++){
      let arr = [];
      for(let j = 0;j < this.rows;j ++){
        let x = i * this.cellSize;
        let y = j * this.cellSize;
        let life = random(0,1) > 0.5 ? 1 : 0;
        arr.push(life);
      }
      this.lifes.push(arr);
    }
  }

  genCells(){
    this.cells = [];
    for(let i = 0;i < this.cols;i ++){
      let arr = [];
      for(let j = 0;j < this.rows;j ++){
        let x = i * this.cellSize;
        let y = j * this.cellSize;
        let w,h;
        w = h = this.cellSize;
        let c = map(this.lifes[i][j],0,1,0,255);
        let cell = new Cell(x + this.cellSize/2,y + this.cellSize/2,w,h,c);
        arr.push(cell);
      }
      this.cells.push(arr);
    }
  }

  genNextLifes(){
    let curr = [];
    for (let i = 0; i < this.cols; i++) {
      let arr = [];
      for (let j = 0; j < this.rows; j++) {
        arr.push(0);
      }
      curr.push(arr);
    }
    for (let i = 1; i < this.cols - 1; i++) {
      for (let j = 1; j < this.rows - 1; j++) {
        let count = 0;
        let flag = 0;

        count = this.getNeighborsLife(i,j);
  
        //死亡：如果某个细胞处于活着状态，在如下情况会死亡，1孤独：如果活着的邻居数量<=1，2群体过剩：如果活着的邻居数量>=4
        //新生：如果某个细胞处于死亡状态，在如下情况会新生，1周围刚好有三个活着的邻居
        //静止：在如下情况细胞会保持死亡活着活着的状态，1活着：如果细胞是活着的且周围有2到3个活着的邻居，2死亡：如果细胞是死亡的且周围活着的邻居数!=3
        if (count >= 4 && this.lifes[i][j]) {//群体过剩死去
          flag = 0;
        } else if (count <= 1 && this.lifes[i][j]) {//孤独死去
          flag = 0;
        } else if (!this.lifes[i][j] && count == 3) {//重生
          flag = 1;
        } else { //其余情况不变
          flag = this.lifes[i][j];
        }
        curr[i][j] = flag;
      }
    }

    return curr;
  }

  display(){
    for(let i = 0;i < this.cols;i ++){
      for(let j = 0;j < this.rows;j ++){
        let cell = this.cells[i][j];
        cell.display();
      }
    }
  }

  applyCellLife(newLifes){
    for(let i = 0;i < this.cols;i ++){
      for(let j = 0;j < this.rows;j ++){
        let cell = this.cells[i][j];
        let c = map(newLifes[i][j],0,1,0,255);
        cell.setC(c);
      }
    }
  }

  async startLoop() {
    while (true) {
        // console.log(this.lifes);
        let newLifes = this.genNextLifes();
        this.applyCellLife(newLifes);
        await this.sleep(this.simulateInterval); 
        this.lifes = newLifes;
    }
  }

  sleep(ms) {
    return new Promise((res)=>{
      setTimeout(res,ms);
    });
  }
}


let ca = null;
function setup() {
  rectMode(CENTER);

  let simulateInterval = 20;//间隔10ms生成下一代
  let cellSize = 10;
  createCanvas(800,600);

  ca = new CA(cellSize,simulateInterval);
  ca.startLoop();
}

function draw() {
  ca.display();
}