import calcRadOfVector from "./calcRadOfVector.js";

/**
 * @typedef {import("./typings.js").Vector2} Vector2 
 * @typedef {import("./typings.js").Size} Size
 */

/**
 * @param {number} x 
 * @param {number} y 
 */
function axisComponentsToVector(x, y) {
  return {
    size: Math.sqrt(x*x + y*y),
    rad: calcRadOfVector(x, y)
  }
}

export default class Velocity {
  constructor({ size=0, rad=0 } = {}) {
    /** @type {number} */
    this.size = size;
    /** @type {number} */
    this.rad = rad;
  }

  get x() {
    return this.size * Math.sin(this.rad);
  }

  get y() {
    return this.size * Math.cos(this.rad);
  }

  /**
   * @param {number}
   */
  set x(x) {
    const vector = axisComponentsToVector(x, this.y);
    this.size = vector.size;
    this.rad = vector.rad;
  }

  /**
   * @param {number}
   */
  set y(y) {
    const vector = axisComponentsToVector(this.x, y);
    this.size = vector.size;
    this.rad = vector.rad;
  }
}

window.Velocity = Velocity;
