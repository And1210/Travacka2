import React from 'react';
import {ReactP5Wrapper} from '@p5-wrapper/react';

class Particle {
  constructor(p5, x, y) {
    this.p5 = p5;
    this.pos = this.p5.createVector(x, y);
    this.vel = this.p5.createVector(0, 1);
    this.acc = this.p5.createVector(0, 0);

    this.maxSpeed = 10;
  }

  update() {
    this.vel.add(this.acc);
    this.vel = this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);

    if (this.pos.y > this.p5.height) {
      this.pos.sub(this.p5.createVector(0, this.p5.height));
    }
    if (this.pos.y < 0) {
      this.pos.add(this.p5.createVector(0, this.p5.height));
    }
    if (this.pos.x > this.p5.width) {
      this.pos.sub(this.p5.createVector(this.p5.width, 0));
    }
    if (this.pos.x < 0) {
      this.pos.add(this.p5.createVector(this.p5.width, 0));
    }
  }

  render() {
    this.p5.noStroke();
    this.p5.fill(0);
    this.p5.circle(this.pos.x, this.pos.y, 10);
  }

  applyForce(a) {
    this.acc.add(a);
  }

  applyFlowField(flowField, gridFac) {
    let gridSizeX = this.p5.width/gridFac, gridSizeY = this.p5.height/gridFac;
    let i = Math.floor(this.pos.x/gridSizeX), j = Math.floor(this.pos.y/gridSizeY);
    if (i >= 0 && i < gridFac && j >= 0 && j < gridFac) {
      this.applyForce(flowField[j][i]);
    }
  }

  applyShapeField(shapePoints) {
    for (let i = 0; i < shapePoints.length; i++) {
      let p = shapePoints[i];
      let nextI = (i+1)%shapePoints.length;
      if (this.p5.constructor.Vector.sub(p, this.pos).magSq() <= 50*50) {
        this.applyForce(this.p5.constructor.Vector.sub(p, shapePoints[nextI]).mult(-0.1));
      }
    }
  }
}

function flowFieldBGSketch(p5) {
  let particles = [];
  let flowField = [];
  let gridFac = 10;
  let noiseFac = 0.1;
  let particleNum = 100;

  let shapePoints = [];
  let shapePointNum = 10;
  let radius = 150;

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);
    for (let i = 0; i < particleNum; i++) {
      particles.push(new Particle(p5, i*(p5.width/particleNum)+(p5.width/(particleNum*2)), Math.floor(p5.random(p5.height))));
    }

    let offset = 0;
    for (let i = 0; i < gridFac; i++) {
      let cur = [];
      for (let j = 0; j < gridFac; j++) {
        cur.push(p5.createVector(2*p5.noise(j*noiseFac+offset)-1, 2*p5.noise(i*noiseFac+offset)-1));
        offset += noiseFac;
      }
      flowField.push(cur);
    }

    for (let i = 0; i < shapePointNum; i++) {
      shapePoints.push(p5.createVector(p5.cos(p5.TWO_PI*i/shapePointNum), p5.sin(p5.TWO_PI*i/shapePointNum)).mult(radius).add(p5.createVector(p5.width/2, p5.height/2)));
    }
  };

  p5.draw = () => {
    p5.background('#FFFFFF10');

    p5.translate(-p5.width/2, -p5.height/2);
    for (let p of particles) {
      p.applyFlowField(flowField, gridFac);
      p.applyShapeField(shapePoints);
      p.update();
    }
    for (let p of particles) {
      p.render();
    }

    // for (let p of shapePoints) {
    //   p5.fill(0, 0, 255);
    //   p5.circle(p.x, p.y, 100);
    // }
  };
}

function FlowFieldBG() {
  return <ReactP5Wrapper sketch={flowFieldBGSketch} />;
}

export default FlowFieldBG;
