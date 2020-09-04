import {formulaEqual} from './formula';

export function applySubstitution(base: any, sub: Map<number, any>) : any {
    if(base.type == "contradiction") return base;

    if(base.type == "proposition"){
        if(sub.has(base.n)) return sub.get(base.n);
        return base;
    }

    if(base.type == "not"){
        return {
            type:'not',
            d:applySubstitution(base.d, sub)
        }
    }

    return {
        type:base.type,
        left:applySubstitution(base.left, sub),
        right:applySubstitution(base.right, sub)
    }
}

export function recognizeSubstitution(base: any, derived: any) : Map<number,any> | undefined {
    let substitution = new Map<number,any>();
    let valid = recognizeSubstitutionRecursive(base, derived, substitution);
    if(valid) return substitution;
    return undefined;
}

export function substitutionsContradict(sub1: Map<number, any>, sub2: Map<number, any>) : boolean {
    for (let [n, formula] of sub1.entries()) {
        if(sub2.has(n) && !formulaEqual(sub1.get(n),sub2.get(n))) return true;
    }
    return false;
}

function recognizeSubstitutionRecursive(base: any, derived: any, sub: Map<number,any>) : boolean {
    if(base.type == "proposition") {
        if(sub.has(base.n) && !formulaEqual(sub.get(base.n),derived)) return false;
        sub.set(base.n, derived);
    } else {
        if(base.type != derived.type) return false;
        if(base.type == "not"){
            return recognizeSubstitutionRecursive(base.d, derived.d, sub);
        } else if (base.type != "contradiction") {
            return recognizeSubstitutionRecursive(base.left, derived.left, sub) && recognizeSubstitutionRecursive(base.right, derived.right, sub)
        }
    }
    return true;
}