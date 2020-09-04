import Deduction from './deduction/deduction';
import {formulaFromString, formulaToString, formulaToLatex} from './deduction/formula';
import {recognizeSubstitution} from './deduction/substitution';
import Vec2 from './math/vec2';

class Main {
  canvas : HTMLCanvasElement;
  ctx : CanvasRenderingContext2D;

  constructor() {
    this.initCanvas();

    let formula = formulaFromString("(p0 or p1)");
    console.log(formulaToString(formula));

    let formula2 = formulaFromString("((not p0) or F)");
    console.log(formulaToString(formula2));

    console.log(formula);
    console.log(formula2);

    console.log(Array.from(recognizeSubstitution(formula, formula2).entries()));

    let d = new Deduction("(p ∧ q) ∧ r",
      new Deduction("p ∧ q",
        new Deduction("p"),
        new Deduction("q",
          new Deduction("t→q"),
          new Deduction("t")
        )
      ),
      new Deduction("r")
    );
    d.draw(this.ctx, new Vec2(400,300));
    //console.log(t.toString());
  }

  initCanvas() : void {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext('2d');

    this.ctx.font = "24px Serif";
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = "center";
  }
}

new Main();