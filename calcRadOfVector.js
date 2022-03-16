/**
 * @param {number} x
 * @param {number} y
 */
export default function calcRadOfVector(x, y) {
  return (Math.atan2(-y, x) + Math.PI*6.5)%(Math.PI*2)
}
