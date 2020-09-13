
export default class Vec2 {
    constructor(readonly x: number, readonly y: number) {}
    
    plus(v: Vec2) : Vec2 { return new Vec2(this.x+v.x, this.y+v.y); }
    scaledBy(f: number) : Vec2 { return new Vec2(f*this.x, f*this.y); }
    minus(v: Vec2) : Vec2 { return this.plus(v.scaledBy(-1.0)); }

    dot(v: Vec2) : number { return this.x*v.x + this.y*v.y; }
    d2() : number { return this.dot(this); }
}