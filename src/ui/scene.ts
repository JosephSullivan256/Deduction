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

    selected: Set<DeductionComponent>;

    constructor() {
        this.initCanvas();
        this.initRuleComponents();
        this.deduction_components = [];
        this.selected = new Set();

        this.update();
    }

    joinSelected(rule_app: RuleApplication) : void {
        this.deduction_components = this.deduction_components.filter(dc=> !this.selected.has(dc));
        let selected_array = Array.from(this.selected);
        this.deduction_components.push(
            new DeductionComponent(new Deduction(rule_app, ...selected_array.map(dc=>dc.deduction)),
            selected_array.map(dc=>dc.pos).reduce((sum, val) => sum.plus(val.minus(this.center)), new Vec2(0,0)).scaledBy(1.0/Math.max(1,selected_array.length)).plus(this.center).plus(new Vec2(Math.random()-0.5,Math.random()-0.5).scaledBy(100))
        ));
        console.log(this.deduction_components);
        this.selected = new Set();
        this.update();
    }

    update() : void {
        for(let rc of this.rules_components){
            rc.update();
        }

        this.draw();
    }

    draw() : void {
        this.ctx.fillStyle = "rgb(255,255,255)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        let style = "rgb(0,0,0)";

        for(let dc of this.deduction_components){
            this.ctx.fillStyle = style;
            this.ctx.strokeStyle = style;
            if(this.selected.has(dc)){
                this.ctx.fillStyle = "rgb(255,0,0)";
                this.ctx.strokeStyle = "rgb(255,0,0)";
            }
            dc.draw(this.ctx);
        }
    }

    select(cursor: Vec2) : void {
        for(let dc of this.deduction_components){
            if(dc.contains(this.ctx, cursor)) {
                this.selected.add(dc);
                break;
            }
        }
        this.update();
    }

    clearSelection() : void {
        this.selected = new Set();
        this.update();
    }

    initCanvas() : void {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');

        //var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
        //this.canvas.width = Math.floor(this.canvas.style.width * scale);
        //this.canvas.height = Math.floor(size * scale);

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