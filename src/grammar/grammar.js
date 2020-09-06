// Generated automatically by nearley, version 2.19.6
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "Main", "symbols": ["Formula"], "postprocess": function(d) {return d[0][0]}},
    {"name": "Formula", "symbols": ["Not"]},
    {"name": "Formula", "symbols": ["And"]},
    {"name": "Formula", "symbols": ["Or"]},
    {"name": "Formula", "symbols": ["Implies"]},
    {"name": "Formula", "symbols": ["Proposition"]},
    {"name": "Formula", "symbols": ["Contradiction"]},
    {"name": "Not", "symbols": [{"literal":"("}, "not", "Formula", {"literal":")"}], "postprocess": function(d) {return {type:'not', subformulas:[d[2][0]]}}},
    {"name": "And", "symbols": [{"literal":"("}, "Formula", "_", "and", "_", "Formula", {"literal":")"}], "postprocess": function(d) {return {type:'and', subformulas:[d[1][0], d[5][0]]}}},
    {"name": "Or", "symbols": [{"literal":"("}, "Formula", "_", "or", "_", "Formula", {"literal":")"}], "postprocess": function(d) {return {type:'or', subformulas:[d[1][0],d[5][0]]}}},
    {"name": "Implies", "symbols": [{"literal":"("}, "Formula", "_", "implies", "_", "Formula", {"literal":")"}], "postprocess": function(d) {return {type:'implies', subformulas:[d[1][0],d[5][0]]}}},
    {"name": "Proposition$subexpression$1", "symbols": [{"literal":"p"}, "number"]},
    {"name": "Proposition$subexpression$1$string$1", "symbols": [{"literal":"p"}, {"literal":"_"}, {"literal":"{"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Proposition$subexpression$1", "symbols": ["Proposition$subexpression$1$string$1", "number", {"literal":"}"}]},
    {"name": "Proposition", "symbols": ["Proposition$subexpression$1"], "postprocess": function(d) {return {type:'proposition', subformulas:[], n:d[0][1]}}},
    {"name": "Proposition$string$1", "symbols": [{"literal":"p"}, {"literal":"_"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "Proposition", "symbols": ["Proposition$string$1", /[0-9]/], "postprocess": function(d) {return {type:'proposition', n:parseInt(d[1])}}},
    {"name": "Proposition", "symbols": [{"literal":"p"}, "subnumber"], "postprocess": function(d) {return {type:'proposition', n:d[1]}}},
    {"name": "Contradiction", "symbols": ["contradiction"], "postprocess": function(d) {return {type:'contradiction', subformulas:[]}}},
    {"name": "contradiction", "symbols": [{"literal":"F"}]},
    {"name": "contradiction", "symbols": [{"literal":"f"}]},
    {"name": "contradiction", "symbols": [{"literal":"⊥"}]},
    {"name": "contradiction", "symbols": [{"literal":"0"}]},
    {"name": "not$string$1", "symbols": [{"literal":"n"}, {"literal":"o"}, {"literal":"t"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "not", "symbols": ["not$string$1"]},
    {"name": "not", "symbols": [{"literal":"~"}]},
    {"name": "not", "symbols": [{"literal":"!"}]},
    {"name": "not", "symbols": [{"literal":"¬"}]},
    {"name": "not$string$2", "symbols": [{"literal":"\\"}, {"literal":"l"}, {"literal":"n"}, {"literal":"o"}, {"literal":"t"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "not", "symbols": ["not$string$2"]},
    {"name": "and$string$1", "symbols": [{"literal":" "}, {"literal":"a"}, {"literal":"n"}, {"literal":"d"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "and", "symbols": ["and$string$1"]},
    {"name": "and", "symbols": [{"literal":"&"}]},
    {"name": "and$string$2", "symbols": [{"literal":"&"}, {"literal":"&"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "and", "symbols": ["and$string$2"]},
    {"name": "and", "symbols": [{"literal":"∧"}]},
    {"name": "and$string$3", "symbols": [{"literal":"\\"}, {"literal":"l"}, {"literal":"a"}, {"literal":"n"}, {"literal":"d"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "and", "symbols": ["and$string$3"]},
    {"name": "or$string$1", "symbols": [{"literal":" "}, {"literal":"o"}, {"literal":"r"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "or", "symbols": ["or$string$1"]},
    {"name": "or$string$2", "symbols": [{"literal":"|"}, {"literal":"|"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "or", "symbols": ["or$string$2"]},
    {"name": "or", "symbols": [{"literal":"∨"}]},
    {"name": "or$string$3", "symbols": [{"literal":"\\"}, {"literal":"l"}, {"literal":"o"}, {"literal":"r"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "or", "symbols": ["or$string$3"]},
    {"name": "implies$string$1", "symbols": [{"literal":" "}, {"literal":"i"}, {"literal":"m"}, {"literal":"p"}, {"literal":"l"}, {"literal":"i"}, {"literal":"e"}, {"literal":"s"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "implies", "symbols": ["implies$string$1"]},
    {"name": "implies$string$2", "symbols": [{"literal":"-"}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "implies", "symbols": ["implies$string$2"]},
    {"name": "implies$string$3", "symbols": [{"literal":"="}, {"literal":">"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "implies", "symbols": ["implies$string$3"]},
    {"name": "implies", "symbols": [{"literal":"→"}]},
    {"name": "implies$string$4", "symbols": [{"literal":"\\"}, {"literal":"r"}, {"literal":"i"}, {"literal":"g"}, {"literal":"h"}, {"literal":"t"}, {"literal":"a"}, {"literal":"r"}, {"literal":"r"}, {"literal":"o"}, {"literal":"w"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "implies", "symbols": ["implies$string$4"]},
    {"name": "number$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$1", "symbols": ["number$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "number", "symbols": ["number$ebnf$1"], "postprocess": function(d) {return parseInt(d[0].join("")) }},
    {"name": "subnumber$ebnf$1$subexpression$1", "symbols": [{"literal":"₀"}]},
    {"name": "subnumber$ebnf$1$subexpression$1", "symbols": [{"literal":"₁"}]},
    {"name": "subnumber$ebnf$1$subexpression$1", "symbols": [{"literal":"₂"}]},
    {"name": "subnumber$ebnf$1$subexpression$1", "symbols": [{"literal":"₃"}]},
    {"name": "subnumber$ebnf$1$subexpression$1", "symbols": [{"literal":"₄"}]},
    {"name": "subnumber$ebnf$1$subexpression$1", "symbols": [{"literal":"₅"}]},
    {"name": "subnumber$ebnf$1$subexpression$1", "symbols": [{"literal":"₆"}]},
    {"name": "subnumber$ebnf$1$subexpression$1", "symbols": [{"literal":"₇"}]},
    {"name": "subnumber$ebnf$1$subexpression$1", "symbols": [{"literal":"₈"}]},
    {"name": "subnumber$ebnf$1$subexpression$1", "symbols": [{"literal":"₉"}]},
    {"name": "subnumber$ebnf$1", "symbols": ["subnumber$ebnf$1$subexpression$1"]},
    {"name": "subnumber$ebnf$1$subexpression$2", "symbols": [{"literal":"₀"}]},
    {"name": "subnumber$ebnf$1$subexpression$2", "symbols": [{"literal":"₁"}]},
    {"name": "subnumber$ebnf$1$subexpression$2", "symbols": [{"literal":"₂"}]},
    {"name": "subnumber$ebnf$1$subexpression$2", "symbols": [{"literal":"₃"}]},
    {"name": "subnumber$ebnf$1$subexpression$2", "symbols": [{"literal":"₄"}]},
    {"name": "subnumber$ebnf$1$subexpression$2", "symbols": [{"literal":"₅"}]},
    {"name": "subnumber$ebnf$1$subexpression$2", "symbols": [{"literal":"₆"}]},
    {"name": "subnumber$ebnf$1$subexpression$2", "symbols": [{"literal":"₇"}]},
    {"name": "subnumber$ebnf$1$subexpression$2", "symbols": [{"literal":"₈"}]},
    {"name": "subnumber$ebnf$1$subexpression$2", "symbols": [{"literal":"₉"}]},
    {"name": "subnumber$ebnf$1", "symbols": ["subnumber$ebnf$1", "subnumber$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "subnumber", "symbols": ["subnumber$ebnf$1"], "postprocess":  function(d) {
        	let normal = ["","0","1","2","3","4","5","6","7","8","9"];
        	let sub = ["₀","₁","₂","₃","₄","₅","₆","₇","₈","₉"];
        	return parseInt(d[0].flat().map((c)=>normal[sub.indexOf(c)+1]).join(""));
        }},
    {"name": "_$ebnf$1", "symbols": []},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"], "postprocess": function(d) {return null }}
]
  , ParserStart: "Main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
