import { Sprite, Texture } from "pixi.js";

export default class Taco {
  // TODO get canvas width and height dinamically
  private CANVAS_WIDTH = 640;
  private CANVAS_HEIGHT = 480;
  private x = this.CANVAS_WIDTH / 3;
  private y = this.CANVAS_HEIGHT / 2;
  private minY = -100; // Set min and max Y just to avoid under and overflowing
  private maxY = this.CANVAS_HEIGHT + 100;
  private speedY = 0;
  private speed = 10;
  private gravity = 60;
  private maxSpeedY = 80;
  private minSpeedY = -80;
  sprite: Sprite;

  reset() {
    this.sprite.position.set(this.x, this.y);
  }

  update() {
    this.y += this.speedY / this.speed;
    this.y = Math.max(this.minY, Math.min(this.maxY, this.y));

    this.speedY += this.gravity / this.speed;

    this.sprite.rotation = Math.atan(this.speedY / this.speed);
    this.sprite.position.set(this.x, this.y);
  }

  flap() {
    this.speedY = this.minSpeedY;
    this.speedY = Math.max(
      this.minSpeedY,
      Math.min(this.maxSpeedY, this.speedY)
    );
  }

  constructor(speed: number, texture: Texture) {
    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.scale.set(-0.4, 0.4);
    this.speed = speed;
    this.reset();
  }
}
