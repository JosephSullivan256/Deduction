import Deduction from '../deduction/deduction';
import Vec2 from '../math/vec2';
import { Formula } from '../deduction/formula';
import { Substitution } from '../deduction/substitution';

export default class DeductionComponent {

    constructor(public deduction: Deduction, public pos: Vec2) {}

    contains(ctx: CanvasRenderingContext2D, cursor: Vec2) : boolean {
        let rootWidth = ctx.measureText(this.deduction.result.conclusion.toString()).width;
        
        if( Math.abs(cursor.x-this.pos.x) < rootWidth/2.0 && Math.abs(cursor.y-this.pos.y) < DeductionComponent.spacing.y/2.0) return true;
        return false;
    }

    draw(ctx: CanvasRenderingContext2D) : void {
        DeductionComponent.drawNode(ctx, this.pos, this.deduction, []);
    }

    private static readonly spacing = new Vec2(100.0, 40.0);

    private static drawNode(ctx: CanvasRenderingContext2D, pos: Vec2, node: Deduction, dischargeable: Array<[Formula, Substitution]>) : void {
        let root = node.result.conclusion.toString();
        let children = node.children;

        let width = ctx.measureText(root).width;
        ctx.fillText(root, pos.x, pos.y);
        if(dischargeable.some(([formula, sub])=> !formula.recognizeSubstitution(node.result.conclusion).conflictsWith(sub))){
            ctx.beginPath();
            ctx.moveTo(pos.x+width*0.6, pos.y-DeductionComponent.spacing.y/2.0);
            ctx.lineTo(pos.x-width*0.6, pos.y+DeductionComponent.spacing.y/2.0);
            ctx.stroke();
        }

        // first, get the width of each subtree
        let widths: Array<number> = [];
        let totalWidth = 0;
        for(let i = 0; i < children.length; i++){
            widths.push(this.getWidth(ctx, children[i]));
            if(i==0 || i==children.length-1){
                if(children.length>1) totalWidth+=this.getWidth(ctx, children[i])/2.0;
            } else {
                totalWidth+=this.getWidth(ctx, children[i]);
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
            let new_dischargeable = [...dischargeable];
            if(node.result.rule.discharged.has(i)) new_dischargeable.push([node.result.rule.discharged.get(i), node.result.sub]);
            this.drawNode(ctx, pos.plus(new Vec2(offset,-this.spacing.y)), children[i], new_dischargeable);
        }
    }

    private static getWidth(ctx: CanvasRenderingContext2D, deduction: Deduction) : number {
        if(deduction.children.length==0){
            return ctx.measureText(deduction.result.conclusion.toString()).width;
        }
        return deduction.children.reduce((a,b)=>a+this.getWidth(ctx,b), 0) + this.spacing.x*(deduction.children.length-1);
    }
}