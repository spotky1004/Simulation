import Simulation from "./Simulation.js";
import Item from "./Item.js";

/** @type {HTMLDivElement} */
const canvasWrapper = document.getElementById("canvas-container");
/** @type {HTMLCanvasElement} */
const canvas = document.getElementById("canvas");

const simulation = new Simulation();
let lastTick = new Date().getTime();
function tick() {
  const timeNow = new Date().getTime();
  const dt = Math.min(16, timeNow - lastTick);
  lastTick = timeNow;

  simulation.tick(dt);
  simulation.draw(
    canvasWrapper,
    canvas
  );

  requestAnimationFrame(tick);
}
tick();

// simulation.addItem(new Item({
//   position: {
//     x: 0,
//     y: 0
//   },
//   size: {
//     width: 100,
//     height: 100
//   }
// }));
simulation.addItem(new Item({
  position: {
    x: 5,
    y: 90
  },
  size: {
    width: 90,
    height: 5
  },
  flags: ["hasCollider"]
}));
for (let i = 0; i < 50; i++) {
  simulation.addItem(new Item({
    position: {
      x: Math.random()*100,
      y: Math.random()*100
    },
    size: {
      width: 2,
      height: 2,
    },
    elasticity: 0.95,
    flags: ["gravity", "hasCollider", "reactsCollider"]
  }));
}
for (let i = 0; i < 50; i++) {
  simulation.addItem(new Item({
    position: {
      x: 50,
      y: 20
    },
    size: {
      width: 1,
      height: 1,
    },
    velocity: {
      rad: Math.PI*(Math.random()*2),
      size: Math.random()*i
    },
    elasticity: 0.9,
    flags: ["gravity", "reactsCollider"]
  }));
}
