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

        this.textbox = document.createElement("input");
        this.textbox.type = "text";
        this.textbox.addEventListener("keydown", ({key}) => {
            if (key === "Enter") {
                event.preventDefault();
                this.apply();
            }
        })

        this.button = document.createElement("button");
        this.button.type = "button";
        this.button.innerHTML = this.rule.name;
        this.button.onclick = ()=>this.apply();

        this.suggestions = document.createElement("p");

        container.appendChild(this.textbox);
        container.appendChild(this.button);
        container.appendChild(this.suggestions);
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
        let sub = this.rule.suggestSubstitution(Array.from(this.scene.selected).map(dc=>dc.deduction.result.conclusion));
        let suggestions : string[] = [];
        if(sub) {
            suggestions=this.rule.conclusions.map(f=>f.toStringSubbed(sub));
        }
        this.suggestions.innerHTML = suggestions.join(", ");
        //let suggestions = this.rule.suggestConclusions(Array.from(this.scene.selected).map(dc=>dc.deduction.result.conclusion))[0]
        //    .map(([conclusion, free])=>conclusion.toStringFree(free));
        //this.suggestions.innerHTML = suggestions.map(formula=>formula.toString()).join(", ");
    }
}