import Deduction from '../deduction/deduction';
import {Formula} from '../deduction/formula';
import {} from '../deduction/substitution';
import Vec2 from '../math/vec2';
import { getRules, RuleApplication } from '../deduction/rule';
import DeductionComponent from '../ui/deduction_component';
import RuleComponent from '../ui/rule_component';

export default class Scene {
    private canvas : HTMLCanvasElement;
    private ctx : CanvasRenderingContext2D;
    private center : Vec2;

    private rules_components: Array<RuleComponent>;
    private deduction_components: Array<DeductionComponent>;

    selected: Array<DeductionComponent>;

    constructor() {
        this.initCanvas();
        this.initRuleComponents();
        this.deduction_components = [];

        let rules = getRules();

        this.deduction_components.push(
            new DeductionComponent(new Deduction(RuleApplication.assumption(Formula.fromString("p0"))), new Vec2(100,100))
        )
        this.deduction_components.push(
            new DeductionComponent(new Deduction(RuleApplication.assumption(Formula.fromString("(p1 and p2)"))), new Vec2(300,100))
        )

        this.selected = this.deduction_components;

        //let assumptions = [d1.result.conclusion, d2.result.conclusion];
        //let conclusion = rules.get("introduce and").apply(assumptions, rules.get("introduce and").suggestConclusions(assumptions)[0][0][0]);
        //let d3 = Deduction.join(conclusion, d1,d2)

        //d1.draw(this.ctx, new Vec2(100,100));
        //d2.draw(this.ctx, new Vec2(300,100));
        //this.deduction_components.push(new DeductionComponent(d3, new Vec2(200,100)))
        //console.log(t.toString());

        this.draw();
    }

    joinSelected(rule_app: RuleApplication) : void {
        this.deduction_components = this.deduction_components.filter(dc=> !this.selected.includes(dc));
        this.deduction_components.push(
            new DeductionComponent(new Deduction(rule_app, ...this.selected.map(dc=>dc.deduction)),
            this.selected.map(dc=>dc.pos).reduce((sum, val) => sum.plus(val.minus(this.center)), new Vec2(0,0)).scaledBy(1.0/Math.max(1,this.selected.length)).plus(this.center)
        ));
        console.log(this.deduction_components);
        this.selected = [];
        this.draw();
    }

    draw() : void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        let style = this.ctx.fillStyle;

        for(let dc of this.deduction_components){
            
            if(this.selected.includes(dc)){
                this.ctx.fillStyle = "rgb(255,0,0)";
                this.ctx.strokeStyle = "rgb(255,0,0)";
            }
            dc.draw(this.ctx);

            this.ctx.fillStyle = style;
            this.ctx.strokeStyle = style;
        }
    }

    select(cursor: Vec2) : void {
        for(let dc of this.deduction_components){
            if(dc.contains(this.ctx, cursor)) {
                this.selected.push(dc);
                break;
            }
        }
        this.draw();
    }

    clearSelection() : void {
        this.selected = [];
        this.draw();
    }

    initCanvas() : void {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');

        this.canvas.addEventListener("click",(ev)=>{
            const rect = this.canvas.getBoundingClientRect()
            const x = ev.clientX - rect.left
            const y = ev.clientY - rect.top
            this.select(new Vec2(x,y));
        })

        this.ctx.font = "24px Serif";
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = "center";
        //this.ctx.fillStyle = "rgb(255,255,255)";
        //this.ctx.strokeStyle = "rgb(255,255,255)";

        this.center = new Vec2(this.canvas.width, this.canvas.height).scaledBy(0.5);
    }

    initRuleComponents() : void {
        this.rules_components = [];
        for(let [id, rule] of getRules().entries()) {
            console.log(rule.name);
            this.rules_components.push(new RuleComponent(this, id, rule));
        }

        document.getElementById("clear selection").addEventListener("click", ()=>{
            this.clearSelection();
        })
    }
}