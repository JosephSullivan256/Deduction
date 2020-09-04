import Deduction from "./deduction";
import { recognizeSubstitution, substitutionsContradict, applySubstitution } from "./substitution";
import { formulaEqual } from "./formula";

export class Rule {

    constructor(
        readonly name: string,
        readonly assumptions: Array<any>,
        readonly deduction: any,
        readonly deductionFlexible: boolean,
        readonly discharged: Array<any>
    ) {}
    
    apply(assumptions: Array<number>, deduction?: any) : RuleApplication{
        let [valid, sub] = this.applyHidden(assumptions, deduction);
        if(!valid) return new RuleApplication(false, null, null, this);
        if(!deduction){
            deduction = applySubstitution(this.deduction, sub);
        }
        return new RuleApplication(true, deduction, sub, this);
    }

    private applyHidden(assumptions: Array<any>, deduction?: any) : [boolean, any] {
        let sub1 = recognizeSubstitution(this.assumptions, assumptions);
        if(!sub1) return [false, null];
        
        if(this.deductionFlexible) {
            if(!deduction) return [false, null];
            let sub2 = recognizeSubstitution(this.deduction, deduction);
            if(!sub2) return [false, null];
            if(substitutionsContradict(sub1,sub2)) return [false, null];

            for (let [n, formula] of sub1.entries()) {
                sub2.set(n, formula);
            }
            return [true, sub2];
        }

        return [true, sub1];
    }

}

export class RuleApplication {
    constructor(readonly valid: boolean, readonly deduction: any, readonly sub: Map<number, any>, readonly rule: Rule) {}

    dischargeable(formula: any) : boolean {
        for(let discharged of this.rule.discharged){
            if(formulaEqual(applySubstitution(discharged, this.sub), formula)) return true;
        }
        return false;
    }
}