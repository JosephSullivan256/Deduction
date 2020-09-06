import Deduction from "./deduction";
import { Substitution } from "./substitution";
import { Symbol, Formula } from "./formula";

export class Rule {

    readonly usedPropositions: Array<Set<Symbol>> // propositions used in nth deduction

    constructor(
        readonly name: string,
        readonly assumptions: Array<Formula>,
        readonly deductions: Array<Formula>,
        readonly discharged: Array<Formula>
    ) {
        this.usedPropositions = new Array<Set<Symbol>>(deductions.length);
        for(let i=0; i<deductions.length; i++){
            this.usedPropositions[i] = deductions[i].usedPropositions();
        }
    }
    
    suggestSubstitution(assumptions: Array<Formula>) : Substitution | undefined {
        if(this.assumptions.length != assumptions.length) return undefined;
        let subs = this.assumptions.map((f,i)=>f.recognizeSubstitution(assumptions[i]));

        if(!Substitution.consistent(subs)) return undefined;
        return Substitution.join(subs);
    }

    // return list of potential deductions paired with list of free propositions

    // I return partially substituted formulas paired with set of free propositions
    // later, a formula is a valid deduction if it can be recognized as a substitution
    // where only free propositions are substituted
    suggestDeduction(assumptions: Array<Formula>) : [Array<[Formula, Set<Symbol>]>, Substitution] {
        let sub = this.suggestSubstitution(assumptions);
        if(sub == undefined) return [[], new Substitution([])];

        // substitute formulas and compute free propositions
        let boundPropositions = sub.usedPropositions();
        return [this.deductions.map(
            f=> [
                f.applySubstitution(sub),
                new Set([...f.usedPropositions()].filter(f2=>boundPropositions.has(f2)))
            ]
        ), sub];
    }

    apply(asssumptions: Array<Formula>, deduction: Formula) : RuleApplication {
        let [potentialDeductions, sub] = this.suggestDeduction(asssumptions);
        potentialDeductions.filter(f=> deduction.applySubstitution(sub).equals(f[0]));
        if(potentialDeductions.length == 0) return undefined;
        
        return new RuleApplication(true, potentialDeductions[0][0], sub, this);
    }

}

export class RuleApplication {
    constructor(readonly valid: boolean, readonly deduction: any, readonly sub: Substitution, readonly rule: Rule) {}

    dischargeable(formula: any) : boolean {
        return this.rule.discharged.some(f=>f.applySubstitution(this.sub).equals(formula));
    }
}

export let rules : Array<Rule> = [
    new Rule(
        "(∧I)",
        [Formula.fromString("p0"), Formula.fromString("p1")],
        [Formula.fromString("(p0 and p1)")],
        []
    ),
    new Rule(
        "(∧E)",
        [Formula.fromString("(p0 and p1)")],
        [Formula.fromString("p0"), Formula.fromString("p1")],
        []
    )
];