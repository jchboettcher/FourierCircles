class Complex {
  constructor(real, i) {
    this.r = real;
    this.i = i;
  }

  zero() {
    if (abs(this.r) < 1e-8) {
      this.r = 0;
    }
    if (abs(this.i) < 1e-8) {
      this.i = 0;
    }
  }

  mag() {
    return Math.sqrt(this.r*this.r+this.i*this.i);
  }

  ata() {
    if (this.r < 0) {
      return Math.atan(this.i/this.r) + PI;
    }
    return Math.atan(this.i/this.r);
  }

}
