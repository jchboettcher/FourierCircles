class Circle {

  constructor(x, y, dia, parent, angle, angleInc) {
    this.x = x;
    this.y = y;
    this.dia = dia;
    this.angle = angle;
    this.parent = parent;
    this.angleInc = angleInc;
  }

  increment(angle) {
    this.angle += this.angleInc;
  }

  update() {
    if (this.parent != null) {
      [this.x, this.y] = this.parent.getTip();
    }
  }

  getTip() {
    return [Math.cos(this.angle)*this.dia*0.5+this.x,this.y-Math.sin(this.angle)*this.dia*0.5]
  }

  show() {
    stroke(0);
    noFill();
    stroke(0,60);
    ellipse(this.x,this.y,this.dia);
    line(this.x,this.y,this.getTip()[0],this.getTip()[1]);
  }

}
