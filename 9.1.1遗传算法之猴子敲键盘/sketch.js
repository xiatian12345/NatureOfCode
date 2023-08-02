//猴子DNA
class MonkeyDNA{
  constructor(target,genes){
    this.target = target;
    let len = this.target.length;
    if(!genes){
      this.generateRandom(len);
    }else{
      this.genes = genes;
    }
  }

  getString(){
    return this.genes.join('');
  }

  getGenes(){
    return this.genes;
  }

  generateRandom(len){
    this.genes = [];
    for(let i = 0;i < len;i ++){
      let c = ' ';
      if(this.target[i] != c){
        c = getRandomC();
      }
      this.genes.push(c);
    }
  }

  //获取适应度
  getFitness(){
    let count = 0;
    for(let i = 0;i < this.target.length;i ++){
      if(this.target[i] === this.genes[i]){
        count ++;
      }
    }

    let ret = Number((count / this.target.length).toFixed(2));
    return ret;
  }
}

//猴子
class Monkey{
  constructor(pos,dna){
    this.pos = pos.copy();
    this.dna = dna || new MonkeyDNA(target);
  }

  getDNA(){
    return this.dna.getString();
  }

  getGenes(){
    return this.dna.getGenes();
  }

  getFitness(){
    return this.dna.getFitness();
  }

  display(){
    text(this.dna.getString(),this.pos.x,this.pos.y)
  }

  getPosition(){
    return this.pos.copy();
  }
}

//种群
class Community{
  constructor(communityCount,pos){
    this.pos = pos || createVector(width/2,20);
    this.arr = [];
    this.communityCount = communityCount;
    //交配池
    this.copulationPool = [];
  }

  getPoitions(){
    let positions = [];
    for(let i = 0;i < this.arr.length;i ++){
      let monkey =  this.arr[i];
      let position = monkey.getPosition();
      positions.push(position);
    }

    return positions;
  }

  //获取最强适应度个体的dna
  getMostStrongFitnessDNA(){
    let most = this.arr[0];
    for(let i = 1;i < this.arr.length;i ++){
      let monkey =  this.arr[i];
      let fit = monkey.getFitness();
      if(fit > most.getFitness()){
        most = monkey;
      }
    }

    return most.getDNA();
  }

  //获取交配池  
  getCopulationPool(){
    let fitness = this.getFitness();
    for(let i = 0;i < fitness.length;i ++){
      let monkey = this.get(i);
      let fit = Math.floor(fitness[i] * 10);
      for(let j = 0;j < fit;j ++){
        this.copulationPool.push(monkey);
      }
    }
    return this.copulationPool;
  }

  //生成随机种群
  generateRandom(){
    this.arr = [];
    for(let i = 0;i < this.communityCount;i ++){
      let x = Math.floor(i/50) * 150;
      let j = i % 50;
      let y = j * 12;
      let pos = p5.Vector.add(this.pos,createVector(x,y));
      let individual = new Monkey(pos);
      this.add(individual);
    }
  }

  //获取适应度
  getFitness(){
    let fitness = [];
    for(let i = 0;i < this.arr.length;i ++){
      let monkey =  this.arr[i];
      let fit = monkey.getFitness();
      fitness.push(fit);
    }

    return fitness;
  }

  display(){
    for(let i = 0;i < this.arr.length;i ++){
      let monkey = this.arr[i];
      monkey.display();
    }
  }

  getTotal(){
    return this.arr.length;
  }

  //获取个体
  get(index){
    return this.arr[index];
  }

  //添加个体
  add(individual){
    this.arr.push(individual);
  }
}

class GA{
  constructor(){
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

  getMostStrongFitnessDNA(){
    return this.community.getMostStrongFitnessDNA();
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
    let positions = this.community.getPoitions();
    this.nextComunity = new Community(this.communityCount);

    for(let i = 0;i < this.communityCount;i ++){//繁殖n次，产生新的种群
      //两个父本
      let parentA = this.getRandFromCopulationPool();
      let parentB = this.getRandFromCopulationPool();


      //父本的两段基因
      let l = parentA.getGenes().slice(0,this.target.length/2);
      let r = parentB.getGenes().slice(this.target.length/2,this.target.length);
      //新个体的基因
      let genes = l.concat(r);

      //基因突变
      if(random(0,1) > 0.9){
        let r = Math.floor(random(0,genes.length));
        while(' ' === genes[r]){
          r = Math.floor(random(0,genes.length));
        }
        genes[r] = getRandomC();
      }

      //新个体的DNA
      let monkeyDNA = new MonkeyDNA(this.target,genes);

      //新个体
      let nextIndividual = new Monkey(positions[i],monkeyDNA);
      //放入新的种群
      this.nextComunity.add(nextIndividual);
    }
  }

  //替换
  replace(){
    this.community = this.nextComunity;
    this.genCount ++;
  }

  //显示
  display(){
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
    this.select();
    this.propagate();
    this.replace();
    this.display();

    this.calcAverateFitness();
  }
}

function getRandomC(){
  let rangeL1 = 65;//65-90 A-Z
  let rangeR1 = 90;//65-90 A-Z

  let rangeL2 = 97;//97-122 a-z
  let rangeR2 = 122;//97-122 a-z

  let c = 65;
  if(random(0,1) > 0.5){
    c = Math.floor(random(rangeL1,rangeR1+1));
  }else{
    c = Math.floor(random(rangeL2,rangeR2+1));
  }
  return String.fromCharCode(c);
}

let ga = null;
let communityCount = 1150;
let averateFitness = 0;
let genCount = 0;
let target = 'to be or not to be';//大概3000代才能实现目标
// let target = 'to be or not';//大概300代能实现目标
// let target = 'to be';//大概几十代即可实现目标


function setup() {
  textSize(10);
  fill(0, 102, 153);

  createCanvas(800,620);
  ga = new GA();
}

function draw() {
  background(100);

  textSize(15);
  text(`目标：${ga.target}`,75,130,200,130);
  text(`平均适应度：${ga.averateFitness}`,75,160,200,130);
  text(`总代数：${ga.genCount}`,75,190,200,130);
  text(`种群数量：${ga.communityCount}`,75,220,200,130);

  let most = ga.getMostStrongFitnessDNA();
  text(`当前最优：${most}`,75,250,300,130);

  if(most == target)  noLoop();

  textSize(10);
  ga.run();
}
