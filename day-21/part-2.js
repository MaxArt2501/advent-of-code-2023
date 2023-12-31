// Directions are mapped as 0 = Up, 1 = Right, 2 = Down, 3 = Left and are
// represented by a couple of row and column shifts (see also day 16-18)
const dirShifts = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const field = input.trim().split('\n')
  .map((line) => line.replace('S', '.'));

// Should be 131
const fieldSize = input.indexOf('\n');

// Should both be 65
const startRow = Math.floor(input.indexOf('S') / (fieldSize + 1));
const startColumn = input.indexOf('S') % (fieldSize + 1);

/** @typedef {`${number},${number}`} Coords  */

/**
 * Return all the cells that could be reached in exactly `steps`
 * @param {number} steps
 */
const walkSteps = (steps) => {
  let frontier = new Set([startRow + ',' + startColumn]);
  const walked = new Set();
  /** @type {Set<Coords>} */
  const exactlyWalked = new Set();
  // We need this to know which cells can be reached. For example, whatever
  // path you take, you cannot reach an adjacent cell with an even amount of
  // steps. Likewise, you cannot reach a cell adjacent to an adjacent cell with
  // an odd amount of steps.
  const parity = steps & 1;

  for (let count = 1; count <= steps; count++) {
    const newFrontier = new Set();
    for (const position of frontier) {
      let [row, column] = position.split(',').map(Number);
      for (const [dr, dc] of dirShifts) {
        const cell = field
          .at((row + dr) % fieldSize)
          .at((column + dc) % fieldSize);
        const newPosition = row + dr + ',' + (column + dc);
        if (cell === '.' && !walked.has(newPosition)) {
          newFrontier.add(newPosition);
          walked.add(newPosition);
          // If we've reached this cell with a number of steps with the same
          // parity of the given total amount, then we can reach this cell with
          // the given amount too (just go forward and backward for the
          // remainder of the steps)
          if ((count & 1) === parity) exactlyWalked.add(newPosition);
        }
      }
    }
    frontier = newFrontier;
  }
  return exactlyWalked;
};

/**
 * Return the cells in a given quadrant from a given set. See later for a
 * detailed explanation
 * @param {Iterable<Coords>} walked
 * @param {number} quadrantRow
 * @param {number} quadrantCol
 * @returns
 */
const getQuadrant = (walked, quadrantRow, quadrantCol) =>
  Array.from(walked, (cell) => cell.split(',').map(Number))
    .filter(
      ([row, column]) =>
        row >= quadrantRow * fieldSize &&
        row < (quadrantRow + 1) * fieldSize &&
        column >= quadrantCol * fieldSize &&
        column < (quadrantCol + 1) * fieldSize
    )
    .map(([row, column]) => row - quadrantRow * fieldSize + ',' + (column - quadrantCol * fieldSize));

/**
 * In order to explain what we're going to do, use the picture explainer.svg
 * So, we start at the center of the field, which is the quadrant marked as 0.
 * If you noticed, the given amount of steps is exactly
 *     26501365 = 131 * 202300 + 65
 * We start at the center of a field, then we move North 65 steps; then we move
 * North 131 * 2 steps, i.e. we walk in a straight line and cover 2 times the
 * field. We end up to the center top cell of a field, which is the tip of the
 * quadrant marked A. If we go all the way to the East, we'd reach the tip of
 * the quadrant B, and so on. All the reachable cells are within the tilted
 * square in the picture.
 * In order to know the total amount of reachable cells, we don't have to run
 * `walkSteps` for 26501365 steps: it'd take forever. Instead, we can compute
 * the amount of cells reached in the quadrants marked A-D, plus the ones in
 * all the quadrants marked 0-1, a-d, and K-M.
 * To do so, we can walk a reduced amount of steps, i.e. enough to cover 2 +
 * the parity of the total fields to cover, and then use `getQuadrant` to know
 * how many cells have been reached there.
 * @param {number} fieldCount
 */
const computeWalkablePlots = fieldCount => {
  const parity = fieldCount & 1;
  const walked = walkSteps((2 + parity) * fieldSize + startRow);
  const plots_0 = getQuadrant(walked, parity, 0).length;
  const plots_1 = getQuadrant(walked, 0, 1 - parity).length;
  const plots_A = getQuadrant(walked, 0, -2 - parity).length;
  const plots_B = getQuadrant(walked, 2 + parity, 0).length;
  const plots_C = getQuadrant(walked, 0, 2 + parity).length;
  const plots_D = getQuadrant(walked, -2 - parity, 0).length;
  const plots_a = getQuadrant(walked, 2 + parity, -1).length;
  const plots_b = getQuadrant(walked, 2 + parity, 1).length;
  const plots_c = getQuadrant(walked, -2 - parity, 1).length;
  const plots_d = getQuadrant(walked, -2 - parity, -1).length;
  const plots_K = getQuadrant(walked, 1 + parity, -1).length;
  const plots_L = getQuadrant(walked, 1 + parity, 1).length;
  const plots_M = getQuadrant(walked, -1 - parity, 1).length;
  const plots_N = getQuadrant(walked, -1 - parity, -1).length;

  return (fieldCount - 1) * (fieldCount - 1) * plots_0
    + fieldCount * fieldCount * plots_1
    + plots_A + plots_B + plots_C + plots_D
    + fieldCount * (plots_a + plots_b + plots_c + plots_d)
    + (fieldCount - 1) * (plots_K + plots_L + plots_M + plots_N);
};

const STEPS = 26501365;
const FIELD_COUNT = (STEPS - startRow) / fieldSize; // Should be 202300
console.log(computeWalkablePlots(FIELD_COUNT));
