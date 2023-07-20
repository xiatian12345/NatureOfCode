class DrawLine{
    constructor(startX,startY,speed){
        this.mapXY = 1;
        this.mapXYCount = 0;

        this.isPathing = false;
        this.lastColor = '';
        this.startX = this.endX= this.currentX = startX;
        this.startY = this.endY= this.currentY = startY;
        this.speed = speed;
        this.lineArray = [{startX,startY,endX:this.endX,endY:this.endY,color:this.getRandomeColor()}];

        strokeWeight(5.0);
        strokeCap(ROUND);
        strokeJoin(ROUND);
    }

    draw(){
        if(this.lineArray.length >= 10)    this.lineArray = [this.lineArray[this.lineArray.length - 1]];//画最近的10个
        for(let i = 0;i < this.lineArray.length;i ++){
            if(!(i === this.lineArray.length - 1 && this.isPathing)){
                let lineObj = this.lineArray[i];
                stroke(lineObj.color);
                line(lineObj.startX,lineObj.startY,lineObj.endX,lineObj.endY);
            }
        }
        if(this.isPathing){
            const last = this.lineArray[this.lineArray.length - 1];
            //通过插值计算下一个线
            const c2LastLineStart = new c2.Line(new c2.Point(last.startX,last.startY),new c2.Point(last.startX,last.startY));
            const c2LastLine = new c2.Line(new c2.Point(last.startX,last.startY),new c2.Point(last.endX,last.endY));
            const dist = c2LastLine.length();
            this.mapXY = map(++this.mapXYCount * this.speed,0,dist,0,1);
            let newC2Line = c2LastLineStart.lerp(c2LastLine,this.mapXY);

            this.currentX = newC2Line.p1.x;
            this.currentY = newC2Line.p1.y;

            //开始画线
            stroke(last.color);
            line(newC2Line.p1.x,newC2Line.p1.y,newC2Line.p2.x,newC2Line.p2.y)
            if(this.mapXY >= 1) this.isPathing = false;
        }
    }

    addNextPoint(x,y){
        this.isPathing = true;
        const last = this.getLastPoint();
        let obj = {
            startX:last.x,
            startY:last.y,
            endX:last.x + x,
            endY:last.y + y,
            color:this.getRandomeColor()
        };
        this.lineArray.push(obj);
        if(x === 0 && y === 0)  this.isPathing = false;
        if(this.isPathing){
            this.mapXY = 0;
            this.mapXYCount = 0;
        }
    }

    getLastPoint(){
        let last = this.lineArray[this.lineArray.length - 1];
        return {
            x:last.endX,
            y:last.endY
        }
    }

    getRandomeColor(){
        return color(random(0,255), random(0,255),random(0,255));
    }
}