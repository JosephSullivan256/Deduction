import Deduction from './deduction'
import Vec2 from './math/vec2';

class Main {
  canvas : HTMLCanvasElement;
  ctx : CanvasRenderingContext2D;

  constructor() {
    this.initCanvas();

    let d = new Deduction("(p ^ q) ^ r",
      new Deduction("p ^ q",
        new Deduction("p"),
        new Deduction("q",
          new Deduction("t->q"),
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