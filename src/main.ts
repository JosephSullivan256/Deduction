import Deduction from './deduction/deduction';
import {Formula} from './deduction/formula';
import {} from './deduction/substitution';
import Vec2 from './math/vec2';
import { rules } from './deduction/rule';

class Main {
  canvas : HTMLCanvasElement;
  ctx : CanvasRenderingContext2D;

  constructor() {
    this.initCanvas();

    let formula = Formula.fromString("(p0 and p1)");
    console.log(formula.toString());

    let formula2 = Formula.fromString("((not p0) and F)");
    console.log(formula2.toString());

    console.log(formula);
    console.log(formula2);

    console.log(formula.recognizeSubstitution(formula2));

    console.log(rules[1].suggestDeduction([formula2]));

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