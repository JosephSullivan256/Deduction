import Deduction from '../deduction/deduction';
import Vec2 from '../math/vec2';

export default class DeductionComponent {

    constructor(public deduction: Deduction, public pos: Vec2) {}

    draw(ctx: CanvasRenderingContext2D) : void {
        this.drawNode(ctx, this.pos, this.deduction);
    }

    private readonly spacing = new Vec2(100.0, 40.0);

    private drawNode(ctx: CanvasRenderingContext2D, pos: Vec2, node: Deduction) : void {
        let root = node.result.conclusion.toString();
        let children = node.children;

        let width = ctx.measureText(root).width;
        ctx.fillText(root, pos.x, pos.y);

        // first, get the width of each subtree
        let widths: Array<number> = [];
        let totalWidth = 0;
        for(let i = 0; i < children.length; i++){
            widths.push(children[i].getWidth(ctx));
            if(i==0 || i==children.length-1){
                totalWidth+=children[i].getWidth(ctx)/2.0;
            } else {
                totalWidth+=children[i].getWidth(ctx);
            }
        }
        totalWidth+=this.spacing.x*(children.length-1);

        // draw line and rule of inference
        if(children.length != 0){
            // TODO make less ugly
            let start = pos.plus(new Vec2(-totalWidth*0.5-ctx.measureText(children[0].result.conclusion.toString()).width*0.5-this.spacing.x*0.1,-this.spacing.y*0.5));
            let end = pos.plus(new Vec2(totalWidth*0.5+ctx.measureText(children[children.length-1].result.conclusion.toString()).width*0.5+this.spacing.x*0.1,-this.spacing.y*0.5));

            ctx.beginPath();
            ctx.moveTo(start.x, start.y);
            ctx.lineTo(end.x,end.y);
            ctx.stroke();

            ctx.fillText(node.result.rule.name,end.x+ctx.measureText(node.result.rule.name).width*0.6,end.y)
        }

        // draw children
        let progress = 0;
        for(let i = 0; i < children.length; i++){
            if(i!=0) progress+=widths[i-1]/2.0+widths[i]/2.0+this.spacing.x;

            let offset = progress-totalWidth/2.0;
            this.drawNode(ctx, pos.plus(new Vec2(offset,-this.spacing.y)), children[i]);
        }
    }

    private getWidth(ctx: CanvasRenderingContext2D) : number {
        if(this.deduction.children.length==0){
            return ctx.measureText(this.deduction.result.conclusion.toString()).width;
        }
        return this.deduction.children.reduce((a,b)=>a+b.getWidth(ctx), 0) + this.spacing.x*(this.deduction.children.length-1);
    }
}