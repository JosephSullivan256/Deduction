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
    
}