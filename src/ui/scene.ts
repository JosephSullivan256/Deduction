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

    private old_translate : Vec2;
    private old_mpos : Vec2;
    private translate : Vec2;

    private rules_components: Array<RuleComponent>;
    private deduction_components: Array<DeductionComponent>;

    private mouseDown : boolean;
    private dragged : DeductionComponent;

    selected: Set<DeductionComponent>;

    constructor() {
        this.initCanvas();
        this.addCanvasEvents();
        this.initRuleComponents();
        this.deduction_components = [];
        this.selected = new Set();

        this.old_translate = new Vec2(0, 0);
        this.translate = new Vec2(0, 0);

        this.update();
    }

    joinSelected(rule_app: RuleApplication) : void {
        this.deduction_components = this.deduction_components.filter(dc=> !this.selected.has(dc));
        let selected_array = Array.from(this.selected);
        let pos = this.center.minus(this.translate);
        if(selected_array.length>0) pos = selected_array.map(dc=>dc.pos).reduce((sum, val)=>sum.plus(val)).scaledBy(1/selected_array.length);
        while(this.deduction_components.some(dc=>dc.pos.minus(pos).d2()<10)) pos = pos.plus(new Vec2(30,0));
        this.deduction_components.push(
            new DeductionComponent(new Deduction(rule_app, ...selected_array.map(dc=>dc.deduction)),
            pos
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

        let old_transform = this.ctx.getTransform();
        this.ctx.translate(this.translate.x,this.translate.y);

        for(let dc of this.deduction_components){
            this.ctx.fillStyle = style;
            this.ctx.strokeStyle = style;
            if(this.selected.has(dc)){
                this.ctx.fillStyle = "rgb(255,0,0)";
                this.ctx.strokeStyle = "rgb(255,0,0)";
            }
            dc.draw(this.ctx);
        }

        this.ctx.setTransform(old_transform);
    }

    select(cursor: Vec2) : DeductionComponent {
        let added;
        for(let dc of [...this.deduction_components].reverse()){
            if(dc.contains(this.ctx, cursor)) {
                this.selected.add(dc);
                added = dc;
                break;
            }
        }
        this.update();
        return added;
    }

    clearSelection() : void {
        this.selected = new Set();
        this.update();
    }

    initCanvas() : void {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');

        // scale everything down using CSS
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';

        let rect = this.canvas.getBoundingClientRect();

        // increase the actual size of our canvas
        this.canvas.width = rect.width * devicePixelRatio;
        this.canvas.height = rect.height * devicePixelRatio;

        this.ctx.resetTransform();

        // ensure all drawing operations are scaled
        this.ctx.scale(devicePixelRatio, devicePixelRatio);

        this.ctx.font = "24px Cambria, Georgia, serif";
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = "center";
        // this.ctx.fillStyle = "rgb(255,255,255)";
        // this.ctx.strokeStyle = "rgb(255,255,255)";

        this.center = new Vec2(this.canvas.width, this.canvas.height).scaledBy(0.5);
    }

    handleMouseDown(pos: Vec2) : void {
        this.dragged = this.select(pos.minus(this.translate));
        if(!this.dragged) this.clearSelection();
        this.mouseDown = true;
        this.old_translate = this.translate;
        this.old_mpos = pos;
    }

    handleMouseMove(pos: Vec2) : void {
        if(this.mouseDown){
            if(this.dragged){
                this.dragged.pos = pos.minus(this.translate);
            } else {
                this.translate = pos.minus(this.old_mpos).plus(this.old_translate);
            }
            this.draw();
        }
    }

    handleMouseUp() : void {
        this.mouseDown = false;
    }

    addCanvasEvents() {
        this.canvas.addEventListener("touchstart", (ev)=>{
            ev.preventDefault();
            if(ev.touches.length==1){
                const rect = this.canvas.getBoundingClientRect();
                const x = ev.touches[0].clientX - rect.left;
                const y = ev.touches[0].clientY - rect.top;
                this.handleMouseDown(new Vec2(x,y));
            }
        })
        this.canvas.addEventListener("mousedown",(ev)=>{
            const rect = this.canvas.getBoundingClientRect();
            const x = ev.clientX - rect.left;
            const y = ev.clientY - rect.top;
            this.handleMouseDown(new Vec2(x,y));
        })
        this.canvas.addEventListener("mousemove", (ev)=>{
            const rect = this.canvas.getBoundingClientRect()
            const x = ev.clientX - rect.left
            const y = ev.clientY - rect.top
            this.handleMouseMove(new Vec2(x,y));
        })
        this.canvas.addEventListener("touchmove", (ev)=>{
            ev.preventDefault();
            const rect = this.canvas.getBoundingClientRect()
            const x = ev.touches[0].clientX - rect.left
            const y = ev.touches[0].clientY - rect.top
            this.handleMouseMove(new Vec2(x,y));
        })

        this.canvas.addEventListener("mouseup", ()=>this.handleMouseUp());
        this.canvas.addEventListener("touchend", ()=>this.handleMouseUp());

        window.addEventListener("resize", ()=>{
            this.initCanvas();
            this.update();
        })
    }

    initRuleComponents() : void {
        this.rules_components = [];
        for(let [id, rule] of getRules().entries()) {
            this.rules_components.push(new RuleComponent(this, id, rule));
        }

        let clearButton = document.getElementById("clear selection");
        if(clearButton) clearButton.addEventListener("click", ()=>{
            this.clearSelection();
        })
    }
}