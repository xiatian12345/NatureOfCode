class Rule{
  constructor(start,to){
    this.start = start;
    this.to = to;
  }

  getStart(){
      return this.start;
  }

  getTo(){
    return this.to;
  }
}

class LSystem{
  constructor(start,rules){
    this.start = start;
    this.rules = rules;
    this.genCount = 0;
  }

  generate(){
    let next = '';
    for (let i = 0; i < this.start.length; i++) {
      let replace = this.start[i];
      for (let j = 0; j < this.rules.length; j++) {
        let start = this.rules[j].getStart();
        if (start === replace) {
          replace = this.rules[j].getTo();
        }
      }
      next += replace;
    }
    this.start = next;
    this.generation++;
    return next;
  }
}

class Turtle{
  constructor(todo,len,angle){
    this.todo = todo;
    this.len = len;
    this.angle = angle;
  }

  run(){
    for(let i = 0;i < this.todo.length;i ++){
      let c = this.todo[i];
      if(c === 'F'){
        line(0,0,0,-this.len);
        translate(0,-this.len);
      }else if(c === '+'){
        rotate(-this.angle);
      }else if(c === '-'){
        rotate(this.angle);
      }else if(c === '['){
        push();
      }else if(c === ']'){
        pop();
      }else if(c === 'R'){
        stroke(255,0,0,255);
      }else if(c === 'G'){
        stroke(0,255,0,255);
      }else if(c === 'B'){
        stroke(0,0,255,255);
      }else if(c === 'Y'){
        stroke(255,255,0,255);
      }
    }
  }

  changeLen(percent){
    this.len = this.len * percent;
  }

  setTodo(todo){
    this.todo = todo;
  }
}

let rules = null;
let lSystem = null;
let turtle = null;
let clickCount = 0;

function setup() {
  createCanvas(windowWidth,windowHeight);
  rules = [new Rule('F','FF'),new Rule('X','RF-[G[X]+BX]+GF[Y+FX]-X')];
  lSystem = new LSystem('X',rules);
  turtle = new Turtle('X',height/30,radians(22.5));
}

function draw() {
  translate(width/2,height);
  background(128);
  turtle.run();
}

function keyPressed(){
  if(clickCount < 5){
    push();
    let gen = lSystem.generate();
    turtle.setTodo(gen);
    turtle.changeLen(0.7);
    pop();
    clickCount ++;
  }
}