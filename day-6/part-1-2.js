const [times, distances] = input
  .trim()
  .split("\n")
  .map((line) => line.slice(9).trim().split(/\s+/).map(Number));

/**
 * This basically solves a 2nd-degree equation. In fact, if `x` is the time
 * of the button is pressed, the covered distance would be `x * (time - x)`,
 * which must be greater than `distance`. So we have to solve the inequality
 *     -x^2 + time * x - distance > 0
 * and compute how many integer solutions there are.
 * @param {number} time
 * @param {number} distance
 */
const countSolutions = (time, distance) => {
  const discr = (time * time - 4 * distance) ** 0.5;
  const x1 = (time + discr) / 2;
  const x2 = (time - discr) / 2;
  // This looks weird in order to handle integer solutions. In fact, we need
  // our final distance to be *greater* than `distance`, so we must exclude
  // the solutions where they match.
  return Math.ceil(x1) - (x2 % 1 ? Math.ceil(x2) : b + 1);
};

const totalSolutions = times
  .map((time, index) => countSolutions(time, distances[index]))
  .reduce((prod, count) => prod * count);
console.log(totalSolutions);

// This means our boats should travel a distance comparable to the one from
// the Earth to the Sun, and the button could be pressed for as long as
// ~12 hours. Also reach speeds around ~100000 km/h, which is enough to leave
// the Earth's orbit and faster than Voyager 1 probe.
const bigTime = Number(times.join(''));
const bigDistance = Number(distances.join(''));
console.log(countSolutions(bigTime, bigDistance));
