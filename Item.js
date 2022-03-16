import Velocity from "./Velocity.js";
import calcRadOfVector from "./calcRadOfVector.js";

/**
 * @typedef {import("./typings.js").Vector2} Vector2 
 * @typedef {import("./typings.js").Size} Size
 * @typedef {import("./typings.js").PhysicalVariables} PhysicalVariables
 */

export default class Item {
  /**
   * @typedef {"hasCollider" | "reactsCollider" | "gravity"} ItemFlags
   */
  /**
   * @typedef Options
   * @property {Size} size
   * @property {Vector2} position
   * @property {{ size: number, rad: number }} velocity
   * @property {number} [elasticity]
   * @property {ItemFlags[]} flags
   */
  /**
   * @param {Options} options 
   */
  constructor(options) {
    /** @type {typeof options["size"]} */
    this.size = options.size ?? { width: 5, height: 5 };
    /** @type {typeof options["position"]} */
    this.position = options.position ?? { x: 0, y: 0 };
    /** @type {Velocity} */
    this.velocity = new Velocity(options.velocity);
    /** @type {typeof options["elasticity"]} */
    this.elasticity = options.elasticity ?? 1;
    /** @type {{ [ K in ItemFlags ]? : boolean }} */
    this.flags = {};
    for (const flag of (options.flags ?? [])) {
      this.flags[flag] = true;
    }
  }

  getCenterPos() {
    return {
      x: this.position.x + this.size.width/2,
      y: this.position.y + this.size.height/2
    };
  }

  /**
   * @typedef TickOptions
   * @property {number} dt
   * @property {Item[]} items
   * @property {PhysicalVariables} varialbes
   */
  /**
   * @param {TickOptions} options 
   */
  tick(options) {
    /** DeltaTime in Seconds */
    const dt_s = options.dt/1000;
    if (this.flags.gravity) {
      this.velocity.y += dt_s * options.varialbes.g;
    }

    this.position.x += this.velocity.x * dt_s;
    this.position.y += this.velocity.y * dt_s;

    if (this.flags.reactsCollider) {
      for (const item of options.items) {
        if (
          item === this ||
          !item.flags.hasCollider
        ) continue;
        const collisionDetected = this.checkCollision(item);
        if (!collisionDetected) continue;
        void this.doCollisionWith(item);
      }
    }
  }

  /**
   * @param {Item} item 
   */
  checkCollision(item) {
    const { size: item1Size, position: item1Position } = this;
    const { size: item2Size, position: item2Position } = item;

    if (
      item1Position.x < item2Position.x + item2Size.width &&
      item1Position.x + item1Size.width > item2Position.x &&
      item1Position.y < item2Position.y + item2Size.height &&
      item1Size.height + item1Position.y > item2Position.y
    ) return true;
    return false;
  }

  /**
   * @param {Item} item 
   * @param {boolean} bidirectional
   */
  doCollisionWith(item, bidirectional=true) {
    if (bidirectional && item.flags.reactsCollider) item.doCollisionWith(this, false);

    const thisPos = this.getCenterPos();
    const itemPos = item.getCenterPos();
    const collisonDeg = calcRadOfVector(
      thisPos.x - itemPos.x,
      -(thisPos.y - itemPos.y)
    );
    const divDeg = calcRadOfVector(item.size.width, item.size.height);
    /** @type {"top" | "bottom" | "left" | "right"} */
    let collisionType = null;
    /**
     * When divDeg of rectangle is θ
     * Range of intersection points is "2π-θ < c | c <= θ", "θ < c <= π-θ", "π-θ < c <= π+θ", "π+θ < c <= 2π-θ"
     */
    if (2*Math.PI-divDeg < collisonDeg || collisonDeg <= divDeg) {
      collisionType = "top";
    } else if (divDeg < collisonDeg && collisonDeg <= Math.PI-divDeg) {
      collisionType = "right";
    } else if (Math.PI-divDeg < collisonDeg && collisonDeg <= Math.PI+divDeg) {
      collisionType = "bottom";
    } else if (Math.PI+divDeg < collisonDeg && collisonDeg <= 2*Math.PI-divDeg) {
      collisionType = "left";
    }

    switch(collisionType) {
      case "top":
        this.velocity.y *= -this.elasticity;
        this.position.y = itemPos.y - item.size.height/2 - this.size.height;
        break;
      case "bottom":
        this.velocity.y *= -this.elasticity;
        this.position.y = itemPos.y + item.size.height/2;
        break;
      case "left":
        this.velocity.x *= -this.elasticity;
        this.position.x = itemPos.x - item.size.width/2 - this.size.width;
        break;
      case "right":
        this.velocity.x *= -this.elasticity;
        this.position.x = itemPos.x + item.size.width/2;
        break;
    }
  }
}
