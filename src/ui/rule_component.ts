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
            this.scene.selected.map(dc=>dc.deduction.result.conclusion),
            formula
        );

        if(conclusion) this.scene.joinSelected(conclusion);
        console.log("successful");
    }
}