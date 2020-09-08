import { Parser, Grammar } from 'nearley';
import { Substitution } from './substitution';
const grammar = require("../grammar/grammar.js");


export enum FormulaType {
    not, or, and, implies, proposition, contradiction
}
export type Symbol = number;


abstract class FormulaBase {
    abstract readonly type: FormulaType;

    constructor(readonly subformulas: Array<Formula>) {}

    get arity() : number {
        return this.subformulas.length;
    }

    abstract toString() : string;
    abstract toLatex() : string;
    equals(formula: Formula) : boolean {
        return this.type==formula.type &&
            this.arity == formula.arity &&
            this.subformulas.every((f,i)=>f.equals(formula.subformulas[i]));
    }
    boundPropositions() : Set<Symbol> {
        let set = new Set<number>();
        this.addBoundPropositions(set);
        return set;
    }
    addBoundPropositions(set: Set<Symbol>) : void {
        this.subformulas.forEach((f)=>f.addBoundPropositions(set));
    }
    recognizeSubstitution(derived: Formula) : Substitution | undefined {
        if(this.type != derived.type) return undefined;

        let subs = this.subformulas.map((f,i)=>f.recognizeSubstitution(derived.subformulas[i]));

        if(subs.some((f)=>f==undefined)) return undefined;
        if(!Substitution.consistent(subs)) return undefined;

        return Substitution.join(subs);
    }
    abstract applySubstitution(sub: Substitution) : Formula;
}


class PropositionFormula extends FormulaBase {
    type = FormulaType.proposition;

    constructor(readonly symbol: Symbol) {super([])}

    toString(): string { return `p${PropositionFormula.convertNumerToSubscript(this.symbol)}`; }
    toLatex(): string { return `p_{${this.symbol}}`; }
    equals(formula: Formula): boolean {
        return this.type == formula.type && this.symbol == (formula as PropositionFormula).symbol;
    }
    addBoundPropositions(set: Set<Symbol>) : void {
        set.add(this.symbol);
    }
    
    recognizeSubstitution(derived: Formula) : Substitution | undefined {
        return new Substitution([[this.symbol, derived]]);
    }

    applySubstitution(sub: Substitution) : Formula {
        if(sub.has(this.symbol)) return sub.get(this.symbol);
        return this;
    }
    
    private static readonly normal = ["0","1","2","3","4","5","6","7","8","9"];
    private static readonly sub = ["","₀","₁","₂","₃","₄","₅","₆","₇","₈","₉"];
    private static convertNumerToSubscript(n: number) : string {
        let input = n.toString();
        let output = "";
        for(let i = 0; i < input.length; i++){
            output+=PropositionFormula.sub[PropositionFormula.normal.indexOf(input.substr(i,i+1))+1];
        }
        return output;
    }
}


class ContradictionFormula extends FormulaBase {
    type = FormulaType.contradiction;
    constructor() {super([])}

    toString(): string { return "⊥"; }
    toLatex(): string { return `\\bot`; }

    recognizeSubstitution(derived: Formula) : Substitution | undefined {
        if(this.type != derived.type) return undefined;
        return new Substitution([]);
    }

    applySubstitution(sub: Substitution) : Formula {
        return new ContradictionFormula();
    }
}


class NotFormula extends FormulaBase {
    type = FormulaType.not;

    constructor(f: Formula) { super([f]) }

    toString(): string { return `(¬${this.subformulas[0].toString()})`; }
    toLatex(): string { return `\\lnot ${this.subformulas[0].toLatex()}`; }
    applySubstitution(sub: Substitution) : Formula {
        return new NotFormula(this.subformulas[0].applySubstitution(sub));
    }
}


class OrFormula extends FormulaBase {
    type = FormulaType.or;

    constructor(left: Formula, right: Formula) { super([left,right]) }

    toString(): string { return `(${this.subformulas[0].toString()} ∨ ${this.subformulas[1].toString()})`; }
    toLatex(): string { return `(${this.subformulas[0].toLatex()} \\lor ${this.subformulas[1].toLatex()})`; }
    applySubstitution(sub: Substitution) : Formula {
        return new OrFormula(this.subformulas[0].applySubstitution(sub),this.subformulas[1].applySubstitution(sub));
    }
}


class AndFormula extends FormulaBase {
    type = FormulaType.or;

    constructor(left: Formula, right: Formula) {super([left,right])}

    toString(): string { return `(${this.subformulas[0].toString()} ∧ ${this.subformulas[1].toString()})`; }
    toLatex(): string { return `(${this.subformulas[0].toLatex()} \\land ${this.subformulas[1].toLatex()})`; }
    applySubstitution(sub: Substitution) : Formula {
        return new AndFormula(this.subformulas[0].applySubstitution(sub),this.subformulas[1].applySubstitution(sub));
    }
}


class ImpliesFormula extends FormulaBase {
    type = FormulaType.or;
    subformulas : Array<Formula>;

    constructor(left: Formula, right: Formula) {super([left,right])}

    toString(): string { return `(${this.subformulas[0].toString()} → ${this.subformulas[1].toString()})`; }
    toLatex(): string { return `(${this.subformulas[0].toString()} \\rightarrow ${this.subformulas[1].toString()})`; }
    applySubstitution(sub: Substitution) : Formula {
        return new ImpliesFormula(this.subformulas[0].applySubstitution(sub),this.subformulas[1].applySubstitution(sub));
    }
}


export type Formula = PropositionFormula | ContradictionFormula | NotFormula | OrFormula | AndFormula | ImpliesFormula;
export {PropositionFormula, ContradictionFormula, NotFormula, OrFormula, AndFormula, ImpliesFormula};



export namespace Formula {
    export function fromString(input: string) : Formula {
        let parser = new Parser(Grammar.fromCompiled(grammar));
        try {
            parser.feed(input);
        } catch (err) {
            console.log("Error at character " + err.offset); // "Error at character 9"
        }
        let parseTree = parser.results[0];
        //parser.finish(); // I think this resets the parser? idk
        return createFormula(parseTree);
    }

    function createFormula(parseTree: any) : Formula {
        switch(parseTree.subformulas.length){
            case 0:{
                if(parseTree.type==="contradiction"){
                    return new ContradictionFormula();
                } else if(parseTree.type==="proposition"){
                    return new PropositionFormula(parseTree.n);
                }
                break;
            }
            case 1:{
                if(parseTree.type==="not"){
                    return new NotFormula(createFormula(parseTree.subformulas[0]));
                }
                break;
            }
            case 2:{
                if(parseTree.type==="or"){
                    return new OrFormula(createFormula(parseTree.subformulas[0]), createFormula(parseTree.subformulas[1]));
                } else if(parseTree.type === "and"){
                    return new AndFormula(createFormula(parseTree.subformulas[0]), createFormula(parseTree.subformulas[1]));
                } else if(parseTree.type === "implies"){
                    return new ImpliesFormula(createFormula(parseTree.subformulas[0]), createFormula(parseTree.subformulas[1]));
                }
                break;
            }
        }
        return null;
    }
}