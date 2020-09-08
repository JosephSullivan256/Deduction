import Vec2 from '../math/vec2'
import { RuleApplication } from './rule';

export default class Deduction{
    children : Array<Deduction>;
    result : RuleApplication;

    constructor(property: RuleApplication, ...children: Array<Deduction>) {
        this.children = children;
        this.result = property;
    }

    static join(conclusion: RuleApplication, ...deductions : Deduction[]) {
        return new Deduction(conclusion, ...deductions);
    }

    private readonly spacing = new Vec2(100.0, 40.0);

    getWidth(ctx: CanvasRenderingContext2D) : number {
        if(this.children.length==0){
            return ctx.measureText(this.result.conclusion.toString()).width;
        }
        return this.children.reduce((a,b)=>a+b.getWidth(ctx), 0) + this.spacing.x*(this.children.length-1);
    }
    
}