import { Graphics } from "pixi.js";

export default class Tube {
  // TODO get canvas width and height dinamically
  private CANVAS_WIDTH = 640;
  private CANVAS_HEIGHT = 480;
  private x = 0;
  private y = 0;
  private gapHeight = 160;
  width = 40;
  private speed = 0;
  sprite = new Graphics();

  reset(x = this.CANVAS_WIDTH + this.width) {
    this.x = x;

    const tubeMinHeight = 60;
    const randomDeltaY =
      Math.random() * (this.CANVAS_HEIGHT - 2 * tubeMinHeight - this.gapHeight);
    this.y = tubeMinHeight + randomDeltaY;
  }

  update() {
    // FIXME: handle speed modifiers differently
    this.x -= this.speed / 16;

    // If the tube is completely out of the screen on the left, reposition it to the right
    if (this.x < -this.width) {
      this.reset();
    }

    this.sprite
      .clear()
      .beginFill(0xffffff, 1)
      .drawRect(this.x, 0, this.width, this.y)
      .drawRect(this.x, this.y + this.gapHeight, this.width, this.CANVAS_HEIGHT)
      .endFill();
  }

  constructor(x: number, speed: number) {
    this.speed = speed;
    this.reset(x);
  }
}
