import { Substitution } from "./substitution";
import { Symbol, Formula } from "./formula";
import Deduction from "./deduction";

export class Rule {

    readonly usedPropositions: Array<Set<Symbol>>; // propositions used in nth deduction
    readonly discharged: Map<number, Formula>;

    constructor(
        readonly name: string,
        readonly assumptions: Array<Formula>,
        readonly conclusions: Array<Formula>,
        discharged: Array<[number, Formula]>
    ) {
        this.usedPropositions = new Array<Set<Symbol>>(conclusions.length);
        for(let i=0; i<conclusions.length; i++){
            this.usedPropositions[i] = conclusions[i].boundPropositions();
        }
        if(!discharged.map(([branch, formula]) => formula).every(formula=>Array.from(formula.boundPropositions()).every(prop=> this.assumptions.some(assumption=> assumption.boundPropositions().has(prop)) || this.usedPropositions.every(set=>set.has(prop))))){
            console.log(`the discharged list for ${this.name} is ambiguous, my code doesn't support your rule sorry :(`);
        }
        this.discharged = new Map(discharged);
    }
    
    suggestSubstitution(assumptions: Array<Formula>) : Substitution | undefined {
        if(this.assumptions.length != assumptions.length) return undefined;
        let subs = this.assumptions.map((f,i)=>f.recognizeSubstitution(assumptions[i]));
        if(subs.some(sub=> !sub)) return undefined;

        if(!Substitution.consistent(subs)) return undefined;
        return Substitution.join(subs);
    }

    // return list of potential deductions paired with list of free propositions

    // I return partially substituted formulas paired with set of free propositions
    // later, a formula is a valid deduction if it can be recognized as a substitution
    // where only free propositions are substituted

    // THIS IS BROKEN WIP. It says that (p1 implies p1) is a conclusion of p0
    suggestConclusions(assumptions: Array<Formula>) : [Array<[Formula, Set<Symbol>]>, Substitution] {
        let sub = this.suggestSubstitution(assumptions);
        if(sub == undefined) return [[], new Substitution([])];

        // substitute formulas and compute free propositions
        let boundPropositions = sub.boundPropositions();
        return [this.conclusions.map(
            f=> [
                f.applySubstitution(sub),
                new Set([...f.boundPropositions()].filter(f2=>!boundPropositions.has(f2)))
            ]
        ), sub];
    }

    apply(asssumptions: Array<Formula>, conclusion: Formula) : RuleApplication {
        let assumptionSub = this.suggestSubstitution(asssumptions);
        if(!assumptionSub) return undefined;

        let conclusionSubs = this.conclusions.map(c=> c.recognizeSubstitution(conclusion));
        let viableConclusionSubs = conclusionSubs.filter(sub => !sub.conflictsWith(assumptionSub));

        if(viableConclusionSubs.length == 0) return undefined;
        return new RuleApplication(conclusion, viableConclusionSubs[0].join(assumptionSub), this);
    }

}

export class RuleApplication {
    constructor(readonly conclusion: Formula, readonly sub: Substitution, readonly rule: Rule) {}

    dischargeable(leaf: Deduction) : boolean {
        let branch = leaf.getBranch(this.conclusion);
        return this.rule.discharged.has(branch) && this.rule.discharged.get(branch).equals(leaf.result.conclusion);
    }

    static assumption(f: Formula) : RuleApplication {
        return new RuleApplication(f, new Substitution([]), getRules().get("assumption"));
    }
}

export function getRules() : Map<string, Rule> {
    let map = new Map<string, Rule>();
    
    map.set("assumption", new Rule(
        "(A)",
        [],
        [Formula.fromString("p0")],
        []
    ));

    map.set("introduce and", new Rule(
        "(∧I)",
        [Formula.fromString("p0"), Formula.fromString("p1")],
        [Formula.fromString("(p0 and p1)")],
        []
    ));

    map.set("eliminate and", new Rule(
        "(∧E)",
        [Formula.fromString("(p0 and p1)")],
        [Formula.fromString("p0"), Formula.fromString("p1")],
        []
    ));

    map.set("introduce implies", new Rule(
        "(→I)",
        [Formula.fromString("p1")],
        [Formula.fromString("(p0 implies p1)")],
        [[0, Formula.fromString("p0")]]
    ));

    map.set("eliminate implies", new Rule(
        "(→E)",
        [Formula.fromString("p0"), Formula.fromString("(p0 implies p1)")],
        [Formula.fromString("p1")],
        []
    ));

    map.set("introduce not", new Rule(
        "(¬I)",
        [Formula.fromString("F")],
        [Formula.fromString("(not p0)")],
        [[0, Formula.fromString("p0")]]
    ));

    map.set("eliminate not", new Rule(
        "(¬E)",
        [Formula.fromString("p0"), Formula.fromString("(not p0)")],
        [Formula.fromString("F")],
        []
    ));

    map.set("raa", new Rule(
        "(RAA)",
        [Formula.fromString("F")],
        [Formula.fromString("p0")],
        [[0, Formula.fromString("(not p0)")]]
    ));

    map.set("introduce or", new Rule(
        "(∨I)",
        [Formula.fromString("p0")],
        [Formula.fromString("(p0 or p1)"), Formula.fromString("(p1 or p0)")],
        []
    ));

    map.set("eliminate or", new Rule(
        "(∨E)",
        [Formula.fromString("(p0 or p1)"), Formula.fromString("p2"), Formula.fromString("p2")],
        [Formula.fromString("p2")],
        [[1, Formula.fromString("p0")], [2, Formula.fromString("p1")]]
    ));

    return map;
}