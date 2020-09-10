import {Symbol, Formula} from './formula';

export class Substitution {
    private readonly mapping : Map<Symbol, Formula>;

    constructor(pairs: Array<[Symbol, Formula]>) {
        this.mapping = new Map<Symbol, Formula>(pairs);
    }

    conflictsWith(sub: Substitution) : boolean {
        for (let [n, formula] of this.mapping.entries()) {
            if(sub.has(n) && !this.get(n).equals(sub.get(n))) return true;
        }
        return false;
    }

    boundPropositions() : Set<Symbol>{
        return new Set(this.mapping.keys());
    }

    static consistent(subs: Array<Substitution>) : boolean {
        for(let i = 0; i < subs.length; i++){
            for(let j = i+1; j < subs.length; j++){
                if(subs[i].conflictsWith(subs[j])) return false;
            }
        }
        return true;
    }

    static join(subs: Array<Substitution>) : Substitution {
        return subs.reduce((joinedSubs, sub)=>joinedSubs.join(sub), new Substitution([]));
    }

    // only well-behaved if "conflictsWith" returns false
    join(sub: Substitution) : Substitution {
        return new Substitution(Array.from(this.mapping.entries()).concat(Array.from(sub.mapping.entries())));
    }

    has(s: Symbol) : boolean {
        return this.mapping.has(s);
    }

    get(s: Symbol) : Formula {
        return this.mapping.get(s);
    }
    
}