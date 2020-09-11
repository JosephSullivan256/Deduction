import { RuleApplication } from './rule';
import { Formula } from './formula';

export default class Deduction{
    children : Array<Deduction>;
    result : RuleApplication;
    parent: Deduction;

    constructor(property: RuleApplication, ...children: Array<Deduction>) {
        this.children = children;
        for(let child of this.children){
            child.parent = this;
        }
        this.result = property;
        this.parent = null;
    }

    static join(conclusion: RuleApplication, ...deductions : Deduction[]) {
        return new Deduction(conclusion, ...deductions);
    }

    getBranch(root: Formula) : number {
        if(this.parent == null) return -1;
        if(this.parent.result.conclusion.equals(root)) return this.parent.children.indexOf(this);
        return this.parent.getBranch(root);
    }
}