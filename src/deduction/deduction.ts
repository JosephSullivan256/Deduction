import Vec2 from '../math/vec2'

export default class Deduction{
    children : Array<Deduction>;
    property : string;
    rule : string;

    constructor(property: string, ...children: Array<Deduction>) {
        this.children = children;
        this.property = property;
        this.rule = "(A)"
    }

    private readonly spacing = new Vec2(100.0, 40.0);

    draw(ctx: CanvasRenderingContext2D, pos: Vec2) : void {
        let width = ctx.measureText(this.property).width;
        ctx.fillText(this.property, pos.x, pos.y);

        // first, get the width of each subtree
        let widths: Array<number> = [];
        let totalWidth = 0;
        for(let i = 0; i < this.children.length; i++){
            widths.push(this.children[i].getWidth(ctx));
            if(i==0 || i==this.children.length-1){
                totalWidth+=this.children[i].getWidth(ctx)/2.0;
            } else {
                totalWidth+=this.children[i].getWidth(ctx);
            }
        }
        totalWidth+=this.spacing.x*(this.children.length-1);

        // draw line and rule of inference
        if(this.children.length != 0){
            let start = pos.plus(new Vec2(-totalWidth*0.5-ctx.measureText(this.children[0].property).width*0.5-this.spacing.x*0.1,-this.spacing.y*0.5));
            let end = pos.plus(new Vec2(totalWidth*0.5+ctx.measureText(this.children[this.children.length-1].property).width*0.5+this.spacing.x*0.1,-this.spacing.y*0.5));

            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x,end.y);
            ctx.stroke();

            ctx.fillText(this.rule,end.x+ctx.measureText(this.rule).width*0.6,end.y)
        }

        // draw children
        let progress = 0;
        for(let i = 0; i < this.children.length; i++){
            if(i!=0) progress+=widths[i-1]/2.0+widths[i]/2.0+this.spacing.x;

            let offset = progress-totalWidth/2.0;
            this.children[i].draw(ctx, pos.plus(new Vec2(offset,-this.spacing.y)));
        }
    }

    getWidth(ctx: CanvasRenderingContext2D) : number {
        if(this.children.length==0){
            return ctx.measureText(this.property).width;
        }
        return this.children.reduce((a,b)=>a+b.getWidth(ctx), 0) + this.spacing.x*(this.children.length-1);
    }
    
}