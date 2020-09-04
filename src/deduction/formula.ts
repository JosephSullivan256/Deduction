import { Parser, Grammar } from 'nearley';
import { isEqual } from 'lodash';
const grammar = require("../grammar/grammar.js");

export function formulaEqual(a: any, b: any) : boolean {
    // lodash will tell whether two objects are funcitonally equal, 
    // rather than just checking if they are the same reference.
    return isEqual(a,b);
}

export function formulaFromString(input: string) : any {
    let parser = new Parser(Grammar.fromCompiled(grammar));
    try {
        parser.feed(input);
    } catch (err) {
        console.log("Error at character " + err.offset); // "Error at character 9"
    }
    let parseTree = parser.results[0];
    parser.finish(); // I think this resets the parser? idk
    return parseTree;
}

export function formulaToString(formula: any) : string {
    switch(formula.type) {
        case "not" : {
            return `(¬${formulaToString(formula.d)})`
        }
        case "or" : {
            return `(${formulaToString(formula.left)} ∨ ${formulaToString(formula.right)})`
        }
        case "and" : {
            return `(${formulaToString(formula.left)} ∧ ${formulaToString(formula.right)})`
        }
        case "implies" : {
            return `(${formulaToString(formula.left)} → ${formulaToString(formula.right)})`
        }
        case "proposition" : {
            let number = convertNumerToSubscript(formula.n);
            return `p${number}`
        }
        case "contradiction" : {
            return '⊥';
        }
    }
    return "";
}

function convertNumerToSubscript(n: number) : string {
    let normal = ["0","1","2","3","4","5","6","7","8","9"];
    let sub = ["","₀","₁","₂","₃","₄","₅","₆","₇","₈","₉"];

    let input = n.toString();
    let output = "";
    for(let i = 0; i < input.length; i++){
        output+=sub[normal.indexOf(input.substr(i,i+1))+1];
    }
    return output;
}

export function formulaToLatex(formula: any) : string {
    switch(formula.type) {
        case "not" : {
            return `(\\lnot ${formulaToLatex(formula.d)})`
        }
        case "or" : {
            return `(${formulaToLatex(formula.left)} \\lor ${formulaToLatex(formula.right)})`
        }
        case "and" : {
            return `(${formulaToLatex(formula.left)} \\land ${formulaToLatex(formula.right)})`
        }
        case "implies" : {
            return `(${formulaToLatex(formula.left)} \\rightarrow ${formulaToLatex(formula.right)})`
        }
        case "proposition" : {
            return `p_{${formula.n}}`
        }
        case "contradiction" : {
            return '\\bot';
        }
    }
    return "";
}