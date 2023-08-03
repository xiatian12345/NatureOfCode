//火箭DNA
class RocketDNA{
  constructor(geneLength,genes){
    this.geneLength = geneLength;
    if(!genes){
      this.generateRandom(geneLength);
    }else{
      this.genes = genes;
    }
  }


  getGenes(){
    let ret = [];
    for(let i = 0;i < this.genes.length;i ++){
      let g = this.genes[i];
      ret.push(createVector(g.x,g.y));
    }
    return ret;
  }

  getGene(index){
    return this.genes[index].copy();
  }

  generateRandom(len){
    this.genes = [];
    for(let i = 0;i < len;i ++){
      let g = getRan2D();
      this.genes.push(g);
    }
  }
}

//火箭
class Rocket{
  constructor(pos,lifeTime,dna){
    this.delayTime = random(0,1)*1000;
    this.millisecond = millis();
    this.canRun = false;
    this.pos = pos.copy();
    this.vel = createVector();
    this.acc = createVector();
    this.angle = Math.PI/2;
    this.lifeTime = lifeTime;
    this.lifeCount = 0;
    this.isDead = false;
    this.dna = dna || new RocketDNA(lifeTime,null);
    this.c = color(100,0,100,200);
    this.fitness = 0;
    this.isCalcFitness = false;
    this.collectWallColor = color(215,0,0,200);
    this.collectTargetColor = color(0,215,0,200);
  }

  getIsDead(){
    return this.isDead;
  }

  collectWall(){
    let deltaPos = createVector(20 * Math.cos(this.angle),20 * Math.sin(this.angle));
    let rocketPos = p5.Vector.add(this.pos,deltaPos);
    for(let i = 0;i < walls.length;i ++){
      let wall = walls[i];
      let pos = wall.pos;
      let w = wall.w;
      let h = wall.h;

      let xl = pos.x - w/2;
      let xr = pos.x + w/2;
      let yt = pos.y - h/2;
      let yb = pos.y + h/2;

      let rocketX = rocketPos.x;
      let rocketY = rocketPos.y;

      if(rocketX >= xl && rocketX <= xr && rocketY >= yt && rocketY <= yb){
        return true;
      }
    }

    return false;
  }

  getDistToTarget(){
    let deltaPos = createVector(20 * Math.cos(this.angle),20 * Math.sin(this.angle));
    let rocketPos = p5.Vector.add(this.pos,deltaPos);
    let targetPos = target.getPos();
    return p5.Vector.dist(rocketPos,targetPos);
  }

  collectTarget(){
    let dist = this.getDistToTarget();
    return dist < target.getR();
  }

  update(){
    let newMillisecond = millis();
    if(newMillisecond - this.millisecond > this.delayTime){
      this.canRun = true;
    }
    if(!this.canRun)  return;
    if(this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0){
      this.c = this.collectWallColor;
      this.isDead = true;
    }

    if(this.lifeCount >= this.lifeTime){
      this.c = this.collectWallColor;
      this.isDead = true;
    }
    let isCollectedW = this.collectWall();
    if(isCollectedW){
      this.c = this.collectWallColor;
      this.isDead = true;
    }

    let isCollectedT = this.collectTarget();
    if(isCollectedT){
      this.c = this.collectTargetColor;
      this.isDead = true;
    }

    if(!this.isDead){
      this.acc = this.dna.getGene(this.lifeCount);
      this.lifeCount ++;

      this.vel.add(this.acc);
      this.pos.add(this.vel);

      if(!this.acc || !this.acc.mult){
        debugger;
      }
  
      this.acc.mult(0);
      this.angle = this.vel.heading();
    }else if(this && !this.isCalcFitness){
      this.fitness = this.calculateFitness();
    }
  }

  getGenes(){
    return this.dna.getGenes();
  }

  calculateFitness(){
    let dist = this.getDistToTarget();
    if(dist - target.getR() < 0.001) return 100000;
    let r = 1/dist * 1/dist * 1/dist * 1000000000;
    console.log(r);
    return r;
  }

  //获取适应度
  getFitness(){
    return this.fitness;
  }

  display(){
    push();
      noFill();
      stroke(this.c);
      translate(this.pos.x,this.pos.y);
      rotate(this.angle);
      beginShape(TRIANGLES);
        let l = createVector(0,5);
        let r = createVector(0,-5);
        let t = createVector(20,0);
        vertex(l.x,l.y);
        vertex(r.x,r.y);
        vertex(t.x,t.y);
      endShape();

      rect(-3,-3,5,1);
      rect(-3, 3,5,1);
    pop();
  }

  getPosition(){
    return this.pos.copy();
  }
}

//种群
class Community{
  constructor(communityCount,pos){
    this.pos = pos || createVector(width/6*5,height/2);
    this.arr = [];
    this.communityCount = communityCount;
    //交配池
    this.copulationPool = [];
  }

  getPos(){
    return this.pos.copy();
  }

  //能否生成下一代群体
  canGenerateNext(){
    let allIsDead = true;
    for(let i = 0;i < this.arr.length;i ++){
      let isDead = this.arr[i].getIsDead();
      allIsDead = allIsDead && isDead;
    }
    return allIsDead;
  }

  destroy(){
    for(let i = this.arr.length - 1;i >= 0;i --){
      this.arr.splice(i,1);
    }
  }

  //获取交配池  
  getCopulationPool(){
    let fitness = this.getFitness();
    for(let i = 0;i < fitness.length;i ++){
      let rocketGenes = this.getGenes(i);
      let fit = Math.floor(fitness[i] * 1);
      for(let j = 0;j < fit;j ++){
        this.copulationPool.push(rocketGenes);
      }
    }
    return this.copulationPool;
  }

  //生成随机种群
  generateRandom(){
    this.arr = [];
    for(let i = 0;i < this.communityCount;i ++){
      let individual = new Rocket(this.pos,lifeTime,null);
      this.add(individual);
    }
  }

  //获取适应度
  getFitness(){
    let fitness = [];
    for(let i = 0;i < this.arr.length;i ++){
      let rocket =  this.arr[i];
      let fit = rocket.getFitness();
      fitness.push(fit);
    }

    return fitness;
  }

  update(){
    for(let i = 0;i < this.arr.length;i ++){
      let rocket = this.arr[i];
      rocket.update();
    }
  }

  display(){
    for(let i = 0;i < this.arr.length;i ++){
      let rocket = this.arr[i];
      rocket.display();
    }
  }

  getTotal(){
    return this.arr.length;
  }

  //获取个体gene
  getGenes(index){
    return this.arr[index].getGenes();
  }

  //添加个体
  add(individual){
    this.arr.push(individual);
  }
}

class GA{
  constructor(){
    this.lifeTime = lifeTime;
    this.target = target;
    this.communityCount = communityCount;
    this.averateFitness = 0;
    this.genCount = 0;
    //创建种群
    this.community = new Community(communityCount);
    this.community.generateRandom();

    //适应度数组
    this.fitness = [];

    //下一代种群
    this.nextComunity = null;
    //交配池
    this.copulationPool = [];
  }


  //选择
  select(){
    //评估适应度
    this.fitness = this.community.getFitness();
    //创建交配池
    this.copulationPool = this.community.getCopulationPool();
  }

  getRandFromCopulationPool(){
    let rand = Math.floor(random(0,this.copulationPool.length));
    return this.copulationPool[rand];
  }

  //繁殖
  propagate(){
    this.nextComunity = new Community(this.communityCount);

    //父本的两段基因
    let parentGeneA = this.getRandFromCopulationPool();
    let parentGeneB = this.getRandFromCopulationPool();

    if(!parentGeneA || !parentGeneB){
      parentGeneA = [];
      for(let i = 0;i < this.lifeTime;i ++){
        let g = getRan2D();
        parentGeneA.push(g);
      }

      parentGeneB = [];
      for(let i = 0;i < this.lifeTime;i ++){
        let g = getRan2D();
        parentGeneB.push(g);
      }
    }
    

    for(let i = 0;i < this.communityCount;i ++){//繁殖n次，产生新的种群
      let genes = [];

      let l = [];//parentGeneA.slice(0,this.lifeTime/2);
      let r = [];//parentGeneB.slice(this.lifeTime/2,this.lifeTime);
      for(let i = 0;i < this.lifeTime/2;i ++){
        l.push(createVector(parentGeneA[i].x,parentGeneA[i].y));
      }
      for(let i = this.lifeTime/2;i < this.lifeTime;i ++){
        l.push(createVector(parentGeneB[i].x,parentGeneB[i].y));
      }
      genes = l.concat(r);

      //基因突变
      let c = Math.floor(genes.length * geneMutantRate);
      for(let i = 0;i < c;i ++){
        let r = Math.floor(random(0,genes.length));
        let rand = getRan2D();
        genes[r] = rand;
      }

      //新个体的DNA
      let rocketDNA = new RocketDNA(lifeTime,genes);

      //新个体
      let nextIndividual = new Rocket(this.community.getPos(),this.lifeTime,rocketDNA);

      //放入新的种群
      this.nextComunity.add(nextIndividual);
    }
  }

  //替换
  replace(){
    this.community.destroy();
    this.community = this.nextComunity;
    this.genCount ++;
  }

  update(){
    this.community.update();
  }

  //显示
  display(){
    text(`平均适应度：${this.averateFitness}`,120,80,200,130);
    text(`总代数：${this.genCount}`,120,95,200,130);
    text(`种群数量：${this.communityCount}`,120,110,200,130);
    this.community.display();
  }

  calcAverateFitness(){
    let avg = 0;
    for(let i = 0;i < this.fitness.length;i ++){
      avg += this.fitness[i];
    }
    if( this.fitness.length > 0)  avg = (avg / this.fitness.length).toFixed(2);

    this.averateFitness = avg;
  }

  run(){
    if(this.community.canGenerateNext()){
      this.select();
      this.propagate();
      this.replace();
  
      this.calcAverateFitness();
    }
  }
}

class Wall{
  constructor(pos,w,h){
    this.pos = pos;
    this.w = w;
    this.h = h;
  }

  display(){
    strokeWeight(2);
    noFill();
    stroke(100,100,100,200);

    rect(this.pos.x,this.pos.y,this.w,this.h);
  }
}

class Target{
  constructor(pos,size){
    this.pos = pos.copy();
    this.size = size;
  }

  getPos(){
    return this.pos.copy();
  }

  getR(){
    return this.size/2;
  }

  update(){

  }

  display(){
    noStroke();
    fill(255,128,128,255);
    circle(this.pos.x,this.pos.y,this.size);
  }
}

function getRan2D(){
  let r = 0.7;
  let g = p5.Vector.random2D().mult(r);
  return g;
}

let ga = null;
let communityCount = 50;//种群数量
let genCount = 0;


let lifeTime = 200;//存活200帧，每一帧都有一个加速度喂给Rocket
let walls = [];
let tempRocket = null;
let target = null;
//突变率
let geneMutantRate = 0.02;

function generateWalls(){
  let w1 = new Wall(createVector(width/2,height/2),200,100);

  let w2 = new Wall(createVector(0,height/2),5,height);
  let w3 = new Wall(createVector(width,height/2),5,height);
  let w4 = new Wall(createVector(width/2,0),width,5);
  let w5 = new Wall(createVector(width/2,height),width,5);

  let w6 = new Wall(createVector(width/4,height/5),width/4,height/8);
  let w7 = new Wall(createVector(width/4*3,height/5),width/4,height/8);
  let w8 = new Wall(createVector(width/4,height/5*4),width/4,height/8);
  let w9 = new Wall(createVector(width/4*3,height/5*4),width/4,height/8);

  let w10 = new Wall(createVector(width/6,height/2),20,width/8);
  let w11 = new Wall(createVector(width/6*5+width/12,height/2),20,width/8);
  let w12 = new Wall(createVector(width/2,height/12),width/9,20);
  let w13 = new Wall(createVector(width/2,height/12*11),width/9,20);

  let w14 = new Wall(createVector(width/2,height/3),10,30);
  let w15 = new Wall(createVector(width/2,height/3*2),10,30);

  walls.push(...[w1,w2,w3,w4,w5,w6,w7,w8,w9,w10,w11,w12,w13,w14,w15]);
}

function showWalls(){
  for(let i = 0;i < walls.length;i ++){
    let wall = walls[i];
    wall.display();
  }
}

function setup() {
  rectMode(CENTER);
  textSize(10);
  fill(0, 102, 153);

  createCanvas(1000,600);

  ga = new GA();
  target = new Target(createVector(width/2,height/5),30);

  generateWalls();
}

function draw() {
  background(220);
  showWalls();

  target.display();

  ga.update();
  ga.display();
  ga.run();
}

function mousePressed(){
  ga = new GA();
  target = new Target(createVector(mouseX,mouseY),30);
}