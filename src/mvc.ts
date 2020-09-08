
// consists of 

class View {
    canvas : HTMLCanvasElement;
    ctx : CanvasRenderingContext2D;

    constructor(){
        this.initCanvas();
    }

    initCanvas() : void {
        this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
        this.ctx = this.canvas.getContext('2d');

        this.ctx.font = "24px Serif";
        this.ctx.textBaseline = 'middle';
        this.ctx.textAlign = "center";
    }
}

class Controller {

}

/*

    Goal: type in formula in top text input, press (A) button, and an (atomic) deduction is created, one that has
    only the assumption as its root formula.

    Then, the user can select multiple deduction roots (ie the conclusion of each deduction), and next to each rule box
    suggested conclusions will appear, with "_" if the proposition is a free occurence. If a valid conslusion is typed
    and the rule button is hit, then the assumption deduction trees all become children of a new deduction tree
    with the conclusion as its root.


    Implementation: We have even listeners, waiting for buttons to be pressed or deductions selected.

*/