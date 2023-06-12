import React from 'react';
import {ReactP5Wrapper} from '@p5-wrapper/react';

import bg from '../imgs/Background.png';

class Particle {
  constructor(p5, x, y, pixels, imgWidth, imgHeight) {
    this.p5 = p5;

    this.size = 2;
    this.speed = this.p5.random(3)+2;

    this.pos = this.p5.createVector(x, y);
    this.vel = this.p5.createVector(0, this.speed);

    this.pixels = pixels;
    this.imgWidth = imgWidth;
    this.imgHeight = imgHeight;
  }

  getColour() {
    let x = Math.floor(this.imgWidth*this.pos.x/this.p5.width);
    let y = Math.floor(this.imgHeight*this.pos.y/this.p5.height);
    let i = x + y*this.imgWidth;
    i *= 4;
    return this.p5.color(this.pixels[i], this.pixels[i+1], this.pixels[i+2], this.pixels[i+3]);
  }

  update() {
    if (this.pos.x > this.p5.width || this.pos.x < 0)
      return;
    if (this.pos.y > this.p5.height) {
      let x = 0;
      let dir = 1;
      if (this.p5.random(2) < 1) {
        x = this.p5.width;
        dir = -1;
      }
      this.pos = this.p5.createVector(x, Math.floor(this.p5.height*this.pos.x/this.p5.width));
      this.vel = this.p5.createVector(dir*this.speed, 0);
    }

    this.pos.add(this.vel);
  }

  render() {
    this.p5.noStroke();
    this.p5.fill(this.getColour());
    this.p5.circle(this.pos.x, this.pos.y, this.size);
  }
}

function travelBGSketch(p5) {
  let bgImg;
  let bgPixels;

  let particles = [];
  let particleCount = 500;

  p5.preload = () => {
    bgImg = p5.loadImage(bg);
  }

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, p5.windowHeight, p5.WEBGL);

    bgImg.loadPixels();
    bgPixels = bgImg.pixels;

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle(p5,
        Math.floor(p5.width*i/particleCount+p5.width/(2*particleCount)),
        0,
        bgPixels,
        bgImg.width,
        bgImg.height
      ));
    }

    p5.background(255);
  };

  p5.draw = () => {

    p5.translate(-p5.width/2, -p5.height/2);
    // p5.image(bgImg, 0, 0);
    for (let p of particles) {
      p.update();
    }
    for (let p of particles) {
      p.render();
    }
  };
}

function TravelBG() {
  return <ReactP5Wrapper sketch={travelBGSketch} />;
}

export default TravelBG;
