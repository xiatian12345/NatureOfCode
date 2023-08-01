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
        stroke(0,255,0,255);
        line(0,0,0,-this.len);
        translate(0,-this.len);
      }else if(c === 'G'){
        translate(0,-this.len);
      }else if(c === '+'){
        rotate(-this.angle);
      }else if(c === '-'){
        rotate(this.angle);
      }else if(c === '['){
        push();
      }else if(c === ']'){
        pop();
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
  rules = [new Rule('F','FF+[+F-F-F]-[-F+F+F]')];
  lSystem = new LSystem('F',rules);
  turtle = new Turtle('F',height/20,radians(25));
}

function draw() {
  translate(width/2,height);
  background(128);
  turtle.run();
}

function keyPressed(){
  if(clickCount < 5){
    let gen = lSystem.generate();
    turtle.setTodo(gen);
    turtle.changeLen(0.7);
    clickCount ++;
  }
}