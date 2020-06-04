
let origspeed = 25; //Change the speed
let maximum = 1000; //Change the maximum number of circles
let size = 300; //Change the size of canvas

let circles = [];
let inc;
let func = [];
let index = 0;
let doTrace = false;
let startDrawing = false;
let trace = [];
let accuracy = 10;
let diffTrace = [];
let doCircles = false;
let speed;

function setup() {
  createCanvas(4*size, 2*size);
  speed = origspeed;
  slider = createSlider(1, maximum, accuracy);
  slider.position(10,10+2*size);
  slider.size(4*size-24);
  angleMode(RADIANS);
}

function createCircles() {
  let added = Math.ceil(accuracy/func.length);
  newfunc = [];
  for (let i = 0; i < func.length; i++) {
    let prev = func[i];
    let prevneg = mult(prev,new Complex(-1,0));
    let new1 = func[(i+1)%func.length];
    let diff = add(new1, prevneg);
    for (let i = 0; i < added; i++) {
      newfunc.push(add(prev,mult(diff, new Complex(i/added,0))));
    }
  }
  let initial = coeff(0,newfunc);
  diffTrace = [];
  let multiplier = 2;
  circles = [new Circle(0,0,initial.mag()*multiplier,null,-initial.ata(),0)];
  for (let k = 1; k <= accuracy*0.5+0.5; k++) {
    let prev = circles[circles.length-1];
    let current = coeff(k,newfunc);
    let mag1 = current.mag();
    if (mag1 != 0) {
      circles.push(new Circle(prev.getTip()[0],prev.getTip()[1],mag1*multiplier,prev,-current.ata(),-k/speed));
    }
    if (accuracy % 2 == 0 || k <= accuracy*0.5-0.5) {
      let prev2 = circles[circles.length-1];
      let current2 = coeff(-k,newfunc);
      let mag2 = current2.mag();
      if (mag2 != 0) {
        circles.push(new Circle(prev2.getTip()[0],prev2.getTip()[1],mag2*multiplier,prev2,-current2.ata(),k/speed));
      }
    }
  }
  doCircles = true;
}

function mousePressed() {
  if (mouseX > 2*size && mouseX < 4*size && mouseY > 0 && mouseY < 2*size) {
    startDrawing = true;
    func = [new Complex(mouseX-3*size, mouseY-size)];
  }
}

function mouseDragged() {
  if (startDrawing) {
    let x = mouseX;
    if (x <= 2*size) {
      x = 2*size+1;
    }
    func.push(new Complex(x - 3*size, mouseY - size));
  }
}

function drawDrawing() {
  push();
  translate(2*size,0);
  stroke(255, 0, 0);
  strokeWeight(2);
  noFill();
  beginShape();
  for (let i = 0; i < func.length; i++) {
    vertex(func[i].r, func[i].i);
  }
  endShape(CLOSE);
  pop();
}

function mouseReleased() {
  if (startDrawing) {
    doTrace = false;
    doCircles = false;
    startDrawing = false;
    createCircles();
  }
}

function mult(c1, c2) {
  return (new Complex(c1.r * c2.r - c1.i * c2.i, c1.r * c2.i + c1.i * c2.r));
}

function e(c) {
  return (new Complex(exp(c.r) * cos(c.i), exp(c.r) * sin(c.i)));
}

function add(c1, c2) {
  return (new Complex(c1.r + c2.r, c2.i + c1.i));

}

function coeff(k, func) {
  let sum = new Complex(0, 0);
  inc = func.length*0.5;
  for (let i = 0; i < func.length; i++) {
    sum = add(sum, mult(new Complex(PI / inc, 0), mult(func[i], e(new Complex(0, -k * (-PI + 0.5 * PI / inc + i * PI / inc))))));
  }
  sum = mult(sum, new Complex(0.5 / PI, 0));
  sum.zero();
  return sum;
}

function draw() {
  if (accuracy != slider.value()) {
    accuracy = slider.value();
    doCircles = false;
    speed = origspeed * max(1, accuracy/500);
    createCircles();
  }
  background(247);
  push();
  strokeWeight(0);
  fill(0);
  textSize(25);
  textAlign(RIGHT,TOP);
  text("Circles: " +accuracy,4*size-10,10);
  if (func.length == 0) {
    fill(255,0,0);
    textSize(40);
    rect(size*3-0.6*textWidth("DRAW HERE"),size+0.73*textAscent(),1.2*textWidth("DRAW HERE"),-1.46*textAscent(),20);
    textAlign(CENTER,CENTER);
    fill(0);
    text("DRAW HERE",size*3, size);
  }
  pop();
  stroke(0);
  translate(size,size);
  strokeWeight(1);
  line(size, -size, size, size);
  strokeWeight(2);
  for (let i = 1; i < circles.length; i++) {
    circles[i].show();
    circles[i].increment();
    circles[i].update();
  }
  strokeWeight(2);
  stroke(255,0,0);
  if (doCircles) {
    push();
    strokeWeight(8);
    stroke(0,0,255);
    point(circles[circles.length - 1].getTip()[0],circles[circles.length - 1].getTip()[1]);
    pop();
  }
  if (doCircles) {
    for (let i = 0; i < diffTrace.length - 1; i++) {
      line(diffTrace[i][0],diffTrace[i][1],diffTrace[i+1][0],diffTrace[i+1][1]);
    }
    if (diffTrace.length < speed*2*PI) {
      diffTrace.push(circles[circles.length - 1].getTip());
    } else {
      line(diffTrace[diffTrace.length-1][0],diffTrace[diffTrace.length-1][1],diffTrace[0][0],diffTrace[0][1]);
    }
  }
  drawDrawing();
}
