// Directions are mapped as 0 = North, 1 = East, 2 = South, 3 = West
// and are represented by a couple of row and column shifts (see also day 16)
const dirShifts = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const heatLossMap = input.trim().split('\n').map(line => Uint8Array.from(line));

/**
 * @param {number} minLength
 * @param {number} maxLength
 */
const findMinHeatLoss = (minLength, maxLength) => {
  /**
   * We map the current state with the current heat lost. The state is a string
   * of space-separated numbers that comprises the row and columns of the cell,
   * the direction (as indexed by `dirShifts`) and how long has been walked in
   * a straight line.
   * We need to track all these info because we could return to the same cell
   * but in a different direction and/or straight line length.
   * @type {Map<`${number} ${number} ${0|1|2|3} ${number}`, number>}
   */
  const visited = new Map([['0 0 1 0', 0]]);
  let frontier = new Set(visited.keys());
  let minHeatLost = Infinity;

  while (frontier.size) {
    const newFrontier = new Set();
    for (const state of frontier) {
      const [row, column, dir, length] = state.split(' ').map(Number);
      const heatLost = visited.get(state);
      // This odd `for` cycle will yield 1, 2, and 4. We'll use these values
      // to get the next directions (adding `dirShift - 1`, modulo 4).
      for (let dirShift = 1; dirShift < 8; dirShift <<= 1) {
        // We either need to keep going straight (if the minimum straight
        // length hasn't been reached) or turn (if the maximum straight
        // length has been reached)
        // `dirShift === 1` = going straight
        // `dirShift !== 1` = turning
        if (
          dirShift !== 1 && length < minLength ||
          dirShift === 1 && length === maxLength
        ) continue;

        // `& 3` is my `% 4`, just faster
        const newDir = (dir + dirShift - 1) & 3;
        const [rowDiff, colDiff] = dirShifts[newDir];
        if (
          (row === 0 && rowDiff < 0) ||
          (column === 0 && colDiff < 0) ||
          row + rowDiff === heatLossMap.length ||
          column + colDiff === heatLossMap[0].length
        ) continue;

        const newRow = row + rowDiff;
        const newCol = column + colDiff;
        const newLength = dirShift === 1 ? length + 1 : 1;
        const key = newRow + ' ' + newCol + ' ' + newDir + ' ' + newLength;
        const newHeatLost = heatLost + heatLossMap[newRow][newCol];
        // If we're already reached the exit and we've lost more heat already,
        // we cut short
        if (minHeatLost <= newHeatLost) continue;

        const posHeatLost = visited.get(key);
        // We're already been here and we already did better: we skip this case
        if (posHeatLost <= newHeatLost) continue;

        newFrontier.add(key);
        visited.set(key, newHeatLost);
        if (newRow === heatLossMap.length - 1 && newCol === heatLossMap[0].length - 1) {
          // We're at the end and we did better
          minHeatLost = newHeatLost;
        }
      }
    }
    frontier = newFrontier;
  }
  return minHeatLost;
}

console.log(findMinHeatLoss(1, 3));
console.log(findMinHeatLoss(4, 10));
