class Cell{
  constructor(x,y,w,h,c){
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.c = c;
  }

  display(){
    noFill();
    stroke(255,0,0,255);
    rect(this.x,this.y,this.w,this.h);
    noStroke();
    fill(this.c,this.c,this.c,255);
    rect(this.x,this.y,this.w,this.h);
  }
}

class CA{
  constructor(cellSize,w,h,deltaX,deltaY,simulateInterval){
    this.deltaX = deltaX;
    this.deltaY = deltaY;
    this.width = w;
    this.height = h;
    this.simulateAllOver = false;
    this.cellSize = cellSize;
    this.ruleSetIndex = 0;
    this.simulateInterval = simulateInterval;//间隔200ms生成新一代细胞

    this.rows = Math.floor(this.height/this.cellSize);
    this.cols = Math.floor(this.width/this.cellSize);

    this.currentGenIndex = 0;//当前是哪一代
    this.currentGenStates = '';
    // this.nextGenStates = '';

    this.totalGenCount = this.getGenCount();

    this.cells = [];

    this._lastRule = '';
    this._currRule = '';
  }

  display(){
    //cell
    for(let i = 0;i < this.currentGenIndex;i ++){
      for(let j = 0;j < this.cols;j ++){
        let cell = this.cells[i][j];
        cell.display();
      }
    }
    //ruleset
    strokeWeight(1);
    stroke(255,0,0,255);
    noFill();
    this._currRule = this.getRuleSet();
    if(this._currRule && this._currRule !== this._lastRule){
      this._lastRule = this._currRule;
      text(this.getRuleName(),width/2,20);
    }
  }

  getRuleName(){
    let rule = this.getRuleSet();
    let dig = parseInt(rule,2)
    return `Rule:${dig}(${rule})`;
  }

  getNextGenStates2(currentGenStates,ruleSet){//'101011100011011100101010100010101010000100000101'//'10010011'
    let neighbors = [];
    for(let i = 0;i < currentGenStates.length;i ++){
      if(0 === i){
        neighbors.push(currentGenStates[currentGenStates.length - 1] + currentGenStates[i] + currentGenStates[i+1]);
      }else if(i === currentGenStates.length - 1){
        neighbors.push(currentGenStates[i - 1] + currentGenStates[i] + currentGenStates[0]);
      }else{
        neighbors.push(currentGenStates[i - 1] + currentGenStates[i] + currentGenStates[i + 1]);
      }
    }
    let result = '';
    for(let i = 0;i < neighbors.length;i ++){
      let neighbor = neighbors[i];
      let number = 7 - parseInt(neighbor,2);
      result += ruleSet[number];
    }

    return result;
  }

  getNextGenStates(currentGenStates){//'101011100011011100101010100010101010000100000101'
    let ruleSet = this.getRuleSet();//'10010011'
    let neighbors = [];
    for(let i = 0;i < currentGenStates.length;i ++){
      if(0 === i){
        neighbors.push(currentGenStates[currentGenStates.length - 1] + currentGenStates[i] + currentGenStates[i+1]);
      }else if(i === currentGenStates.length - 1){
        neighbors.push(currentGenStates[i - 1] + currentGenStates[i] + currentGenStates[0]);
      }else{
        neighbors.push(currentGenStates[i - 1] + currentGenStates[i] + currentGenStates[i + 1]);
      }
    }
    let result = '';
    for(let i = 0;i < neighbors.length;i ++){
      let neighbor = neighbors[i];
      let number = 7 - parseInt(neighbor,2);
      result += ruleSet[number];
    }

    return result;
  }

  //细胞自动机一共有多少代
  getGenCount(){
    return Math.ceil(this.height/this.cellSize);
  }

  //获取当前的规则集
  getRuleSet(){
    if(this.ruleSetIndex >= 256)  return null;
    let decimalNumber = this.ruleSetIndex;//3
    let binaryString = decimalNumber.toString(2).padStart(8, '0');
    return binaryString; // 输出: "00000011"
  }

  async startLoop() {
    while (true && !this.simulateAllOver) {
        // console.log('startLoop');
        let ruleSet = this.getRuleSet();
        if(ruleSet){
          if(this.currentGenIndex === 0){
            let getRand = function(){
              if(random(0,1) > 0.5){
                 return 1;
              }else{
                return 0;
              }
            }
            let genNewArr = ()=>{
              let ret = [];
              for(let i = 0;i < this.cols;i ++){
                ret.push(getRand());
              }
              return ret.join('');
            }
            // this.currentGenStates = genNewArr();//随机生成的
            let gen = genNewArr().replaceAll('0','1');
            var middleIndex = Math.floor(gen.length / 2);
            gen = gen.substring(0, middleIndex) + '0' + gen.substring(middleIndex + 1);
            this.currentGenStates = gen;
          }else{
            this.currentGenStates = this.getNextGenStates(this.currentGenStates);;
          }

          let arr = [];
          for(let i = 0;i < this.currentGenStates.length;i ++){
            let deltaX = this.cellSize/2;
            let deltaY = this.cellSize/2;
            let state = +this.currentGenStates[i];
            let c = map(state,0,1,0,255);
            let cell = new Cell(deltaX + i * this.cellSize + this.deltaX,deltaY+this.cellSize*this.currentGenIndex + this.deltaY,this.cellSize,this.cellSize,c);
            arr.push(cell);
          }
          this.cells.push(arr);

          this.currentGenIndex ++;
          if(this.currentGenIndex > this.totalGenCount){
            if(isCapture) saveCanvas(this.getRuleName(), 'png');
            await this.sleep(this.simulateInterval*3); 
            this.currentGenIndex = 0;
            this.cells = [];
            this.ruleSetIndex ++;
            clear();
          }

        }else{
          this.simulateAllOver = true;
          noLoop();
        }

        await this.sleep(this.simulateInterval); 
    }
  }
  
  sleep(ms) {
    return new Promise((res)=>{
      setTimeout(res,ms);
    });
  }
}


let ca = null;
let isCapture = false;//是否截图
function setup() {
  rectMode(CENTER);

  let deltaX = 10;
  let deltaY = 30;
  let simulateInterval = 2;//间隔20ms生成下一代
  createCanvas(600+deltaX*2,400+deltaY+deltaX)
  ca = new CA(20,600,400,deltaX,deltaY,simulateInterval);
  ca.startLoop();
}

function draw() {
  strokeWeight(2);
  stroke(0,255,0,255);
  noFill();
  rect(width/2,height/2,width,height);
  strokeWeight(1);

  ca.display();
}