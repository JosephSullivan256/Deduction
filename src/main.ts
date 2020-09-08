import Deduction from './deduction/deduction';
import {Formula} from './deduction/formula';
import {} from './deduction/substitution';
import Vec2 from './math/vec2';
import { rules, RuleApplication } from './deduction/rule';
import DeductionComponent from './rendering/deduction_component';

class Main {
    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;

    constructor() {
        this.initCanvas();

        let d1 = new Deduction(RuleApplication.assumption(Formula.fromString("p0")));
        let d2 = new Deduction(RuleApplication.assumption(Formula.fromString("(p1 and p2)")));

        let assumptions = [d1.result.conclusion, d2.result.conclusion];
        let conclusion = rules["introduce and"].apply(assumptions, rules["introduce and"].suggestConclusions(assumptions)[0][0][0]);
        let d3 = Deduction.join(conclusion, d1,d2)

        //d1.draw(this.ctx, new Vec2(100,100));
        //d2.draw(this.ctx, new Vec2(300,100));
        new DeductionComponent(d3, new Vec2(200,100)).draw(this.ctx);
        //console.log(t.toString());
    }

    initCanvas() : void {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');

        this.ctx.font = "24px Serif";
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = "center";
        //this.ctx.fillStyle = "rgb(255,255,255)";
        //this.ctx.strokeStyle = "rgb(255,255,255)";
    }
}

new Main();