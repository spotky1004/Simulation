import Item from "./Item.js";

/**
 * @typedef {import("./typings.js").Vector2} Vector2 
 * @typedef {import("./typings.js").Size} Size
 * @typedef {import("./typings.js").PhysicalVariables} PhysicalVariables
 */

export default class Simulation {
  constructor() {
    /** @type {number} */
    this.hue = 0;
    /** @type {Size} */
    this.size = {
      width: 100,
      height: 100,
    };
    /** @type {Vector2} */
    this.position = { x: 0, y: 0 };
    /** @type {Item[]} */
    this.items = [];
    /** @type {PhysicalVariables} */
    this.variables = {
      g: 9.8,
    };
  }

  /**
   * @param {Item} item 
   */
  addItem(item) {
    if (item instanceof Item) {
      this.items.push(item);
    }
  }

  /**
   * @param {number} dt 
   */
  tick(dt) {
    this.hue += dt/200;
    /** @type {Parameters<Item["tick"]>["0"]} */
    const itemTickData = {
      dt,
      varialbes: this.variables,
      items: this.items
    };
    for (const item of this.items) {
      void item.tick(itemTickData);
    }
  }

  /**
   * @param {HTMLElement} cavnasWrapper
   * @param {HTMLCanvasElement} canvas 
   */
  draw(cavnasWrapper, canvas) {
    const ctx = canvas.getContext("2d");

    // Calculate sizeUnit
    const maxLength = Math.min(cavnasWrapper.offsetWidth, cavnasWrapper.offsetHeight) * 0.85;
    const baseSize = Math.max(100, this.size.height, this.size.width);
    const sizeUnit = maxLength/baseSize;
    
    // Set drawing datas
    /** @type {Vector2} */
    const drawOffset = {
      x: sizeUnit * this.position.x,
      y: sizeUnit * this.position.y
    };
    /** @type {Size} */
    const drawSize = {
      width: Math.floor(sizeUnit * this.size.width),
      height: Math.floor(sizeUnit * this.size.height)
    };

    // Set canvas size if different
    if (
      canvas.width !== drawSize.width ||
      canvas.height !== drawSize.height
    ) {
      canvas.width = drawSize.width;
      canvas.height = drawSize.height;
    }

    ctx.fillStyle = "#fff";
    ctx.globalAlpha = 0.4;
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fill();
    ctx.globalAlpha = 1;

    let i = 0;
    // Draw items on canvas
    for (const item of this.items) {
      ctx.fillStyle = `hsl(${this.hue+i*16}, 50%, 50%)`;
      const { position, size } = item;
      /** @type {Vector2} */
      const drawPosition = {
        x: sizeUnit * position.x - drawOffset.x,
        y: sizeUnit * position.y - drawOffset.y
      };
      /** @type {Size} */
      const drawSize = {
        width: sizeUnit * size.width,
        height: sizeUnit * size.height
      }
      ctx.beginPath();
      ctx.rect(
        drawPosition.x,
        drawPosition.y,
        drawSize.width,
        drawSize.height
      );
      ctx.fill();
      i++;
    }
  }
}
