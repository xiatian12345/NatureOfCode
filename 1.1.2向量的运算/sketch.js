function printVector(vs,ns){
  for(let i = 0;i < vs.length;i ++){
    console.log(ns[i] + ' = ' + vs[i].toString());
  }
  console.log('\n\n');
}

let v1 = null;
let v2 = null;
function setup() {
  createCanvas(800, 600);
  background('DodgerBlue');

  //set 设置向量的值
  v1 = createVector(1,1);
  let set = v1.set(100,200);
  printVector([v1,set],['v1','set']);

  //copy 拷贝向量
  v1 = createVector(1,1);
  let copy = v1.copy();
  printVector([v1,copy],['v1','copy']);

  //add 向量相加
  v1 = createVector(1,1);
  v2 = createVector(10,10);
  let add = v1.add(v2);
  printVector([v1,v2,add],['v1','v2','add']);

  //rem 向量像除得到的余数
  v1 = createVector(3,4);
  v2 = createVector(2,2);
  let rem = v1.rem(v2);
  printVector([v1,v2,rem],['v1','v2','rem']);

  //sub 向量相减
  v1 = createVector(1,1);
  v2 = createVector(10,10);
  let sub = v1.sub(v2);
  printVector([v1,v2,sub],['v1','v2','sub']);

  //mul 向量相乘
  v1 = createVector(2,2);
  v2 = createVector(10,10);
  let mult = v1.mult(v2);
  printVector([v1,v2,mult],['v1','v2','mult']);

  //div 向量相除
  v1 = createVector(2,2);
  v2 = createVector(10,10);
  let div = v1.div(v2);
  printVector([v1,v2,div],['v1','v2','div']);

  //mag 向量长度
  v1 = createVector(1,1);
  let mag = v1.mag();
  printVector([v1,mag],['v1','mag']);

  //magSq 向量长度的平方
  v1 = createVector(1,1);
  let magSq = v1.magSq();
  printVector([v1,magSq],['v1','magSq']);

  //dot 点乘
  v1 = createVector(0,1);
  v2 = createVector(2,0);
  let dot = v1.dot(v2);
  printVector([v1,v2,dot],['v1','v2','dot']);

  //cross 叉乘
  v1 = createVector(0,1);
  v2 = createVector(2,0);
  let cross = v1.cross(v2);
  printVector([v1,v2,cross],['v1','v2','cross']);

  //dist 距离
  v1 = createVector(0,1);
  v2 = createVector(1,0);
  let dist = v1.dist(v2);
  printVector([v1,v2,dist],['v1','v2','dist']);

  //normalize 标准化
  v1 = createVector(10,10);
  let normalize = v1.normalize();
  printVector([v1,normalize],['v1','normalize']);

  //limit 限制长度
  v1 = createVector(10,10);
  let limit = v1.limit(2);
  printVector([v1,limit],['v1','limit']);

  //setMag 设置长度
  v1 = createVector(10,10);
  let setMag = v1.setMag(1);
  printVector([v1,setMag],['v1','setMag']);

  //heading 向量角度
  v1 = createVector(1,1);
  let heading = v1.heading();
  printVector([v1,heading],['v1','heading deg']);
  let headingDegree = degrees(heading);
  console.log('heading deg angel is ',headingDegree,'\n');

  //setHeading 设置向量的角度
  v1 = createVector(1,1);
  let setHeading = v1.setHeading(PI/2);
  printVector([v1,setHeading],['v1','setHeading']);

  //rotate 旋转
  v1 = createVector(0,1);
  let rotate = v1.rotate(PI/2);
  printVector([v1,rotate],['v1','rotate']);

  //angleBetween 两个向量的夹角
  v1 = createVector(0,1);
  v2 = createVector(1,0);
  let angleBetween = v1.angleBetween(v2);
  printVector([v1,v2,angleBetween],['v1','v2','angleBetween']);
  let angleBetweenDeg = degrees(angleBetween);
  console.log('angleBetweenDeg angel is ',angleBetweenDeg,'\n');

  //lerp 线性插值1
  v1 = createVector(0,1);
  v2 = createVector(1,0);
  let lerp = v1.lerp(v2,0.5);
  printVector([v1,v2,lerp],['v1','v2','lerp']);

  //slerp 球形(sphere)线性插值
  v1 = createVector(0,1);
  v2 = createVector(1,0);
  let slerp = v1.slerp(v2,0.5);
  printVector([v1,v2,slerp],['v1','v2','slerp']);

  //reflect 在 2D 中反射直线的法线向量，或在 3D 中反射平面的法线的向量
  v1 = createVector(0,1);
  v2 = createVector(1,0);
  let reflect = v1.reflect(v2);
  printVector([v1,v2,reflect],['v1','v2','reflect']);

  //array 向量值组成的数组
  v1 = createVector(0,1);
  let array = v1.array(v2);
  printVector([v1,array],['v1','array']);


  //equals 相等
  v1 = createVector(0,1);
  v2 = createVector(0,1);
  let equals = v1.equals(v2);
  printVector([v1,v2,equals],['v1','v2','equals']);


  //fromAngle 从给定角度生成单位向量
  let ang = PI;
  let fromAngle = p5.Vector.fromAngle(ang);
  printVector([fromAngle],['fromAngle']);

  //fromAngles 从极角和方位角生成向量
  let theta = PI / 4; // 极角
  let phi = PI / 6;//方位角
  let fromAngles = p5.Vector.fromAngles(theta, phi);
  printVector([fromAngles],['fromAngles']);

  //random2D 随机2d单位向量
  let random2D = p5.Vector.random2D();
  printVector([random2D],['random2D']);

  //random3D 随机3d单位向量
  let random3D = p5.Vector.random3D();
  printVector([random3D],['random3D']);
}

function draw() {

}
