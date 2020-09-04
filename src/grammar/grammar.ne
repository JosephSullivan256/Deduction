Main -> Formula {% function(d) {return d[0][0]} %}
Formula -> Not | And | Or | Implies | Proposition | Contradiction

Not -> "(" not Formula ")" {% function(d) {return {type:'not', d:d[2][0]}} %}
And -> "(" Formula _ and _ Formula ")" {% function(d) {return {type:'and', left:d[1][0], right:d[5][0]}} %}
Or -> "(" Formula _ or _ Formula ")" {% function(d) {return {type:'or', left:d[1][0], right:d[5][0]}} %}
Implies -> "(" Formula _ implies _ Formula ")" {% function(d) {return {type:'implies', left:d[1][0], right:d[5][0]}} %}

Proposition -> ("p" number | "p_{" number "}") {% function(d) {return {type:'proposition', n:d[0][1]}} %}
| "p_" [0-9] {% function(d) {return {type:'proposition', n:parseInt(d[1])}} %}
| "p" subnumber {% function(d) {return {type:'proposition', n:d[1]}} %}

Contradiction -> contradiction {% function(d) {return {type:'contradiction'}}%}

contradiction -> "F" | "f" | "⊥" | "0"
not -> "not " | "~" | "!" | "¬" | "\\lnot "
and -> " and " | "&" | "&&" | "∧" | "\\land "
or -> " or " | "||" | "∨" | "\\lor "
implies -> " implies " | "->" | "=>" | "→" | "\\rightarrow "
number -> [0-9]:+ {% function(d) {return parseInt(d[0].join("")) }%}
subnumber -> ("₀"|"₁"|"₂"|"₃"|"₄"|"₅"|"₆"|"₇"|"₈"|"₉"):+ {% function(d) {
	let normal = ["","0","1","2","3","4","5","6","7","8","9"];
	let sub = ["₀","₁","₂","₃","₄","₅","₆","₇","₈","₉"];
	return parseInt(d[0].flat().map((c)=>normal[sub.indexOf(c)+1]).join(""));
}%}

_ -> [\s]:*     {% function(d) {return null } %}
