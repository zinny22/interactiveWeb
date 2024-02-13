import { randomNumBetween } from "./utils.js";

export default class Particle {
  constructor() {
    this.rFriction = randomNumBetween(0.95, 1.01);
    this.rAlpha = randomNumBetween(0, 5);
    this.r = innerHeight / 4;

    this.angelFriction = randomNumBetween(0.97, 0.99);
    this.angelAlpha = randomNumBetween(1, 2);
    this.angel = randomNumBetween(0, 360);

    this.opacity = randomNumBetween(0.2, 1);
  }

  update() {
    this.rAlpha *= this.rFriction;
    this.r += this.rAlpha;

    this.angelAlpha *= this.angelFriction;
    this.angel += this.angelAlpha;

    this.x = innerWidth / 2 + this.r * Math.cos((Math.PI / 180) * this.angel);
    this.y = innerHeight / 2 + this.r * Math.sin((Math.PI / 180) * this.angel);

    this.opacity -= 0.003;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
    ctx.fill();
    ctx.closePath();
  }
}
