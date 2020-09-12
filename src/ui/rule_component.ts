import { Rule } from "../deduction/rule";
import Scene from "./scene";
import { Formula } from "../deduction/formula";


export default class RuleComponent {
    scene: Scene;

    textbox: HTMLInputElement;
    button: HTMLButtonElement;
    suggestions: HTMLParagraphElement;
    rule: Rule;

    constructor(scene: Scene, id: string, rule: Rule) {
        this.scene = scene;
        this.rule = rule;
        let container = document.getElementById(id);

        this.textbox = container.querySelector(".deduction-textbox") ?? container.appendChild(document.createElement("input"));
        this.textbox.type = "text";
        this.textbox.classList.add("deduction-textbook");
        this.textbox.addEventListener("keydown", ({key}) => {
            if (key === "Enter") {
                event.preventDefault();
                this.apply();
            }
        })

        this.button = container.querySelector(".deduction-button") ?? container.appendChild(document.createElement("input"));
        this.button.type = "button";
        this.button.classList.add("deduction-button");
        this.button.value = this.rule.name;
        this.button.onclick = ()=>this.apply();

        this.suggestions = container.querySelector(".deduction-suggestions") ?? container.appendChild(document.createElement("p"));
        this.suggestions.classList.add("deduction-suggestions");
    }

    apply() : void {
        let value = this.textbox.value;
        this.textbox.value = "";
        console.log(this.rule);

        let formula = Formula.fromString(value);
        if(!formula) return;

        let conclusion = this.rule.apply(
            Array.from(this.scene.selected).map(dc=>dc.deduction.result.conclusion),
            formula
        );

        if(conclusion) this.scene.joinSelected(conclusion);
        console.log("successful");
    }

    update() : void {
        this.suggestions.innerHTML = "";
        let sub = this.rule.suggestSubstitution(Array.from(this.scene.selected).map(dc=>dc.deduction.result.conclusion));
        if(sub) {
            this.rule.conclusions.forEach(f=>{
                let button = document.createElement("input");
                button.type = "button";
                button.classList.add("button");
                button.classList.add("is-info");
                button.value = f.toStringSubbed(sub);
                button.onclick = ()=> this.textbox.value = button.value;
                this.suggestions.appendChild(button);
            })
            this.textbox.disabled = false;
            this.button.disabled = false;
        } else {
            this.button.disabled = true;
            this.textbox.disabled = true;
        }
        //this.suggestions.innerHTML = suggestions.join(", ");
        //let suggestions = this.rule.suggestConclusions(Array.from(this.scene.selected).map(dc=>dc.deduction.result.conclusion))[0]
        //    .map(([conclusion, free])=>conclusion.toStringFree(free));
        //this.suggestions.innerHTML = suggestions.map(formula=>formula.toString()).join(", ");
    }
}