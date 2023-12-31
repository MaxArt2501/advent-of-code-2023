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

let reachedPlots = new Set([startRow + ',' + startColumn]);
// This is not efficient, but eh, who cares?
for (let steps = 0; steps < 64; steps++) {
  const newFrontier = new Set();
  for (const position of reachedPlots) {
    let [row, column] = position.split(',').map(Number);
    for (const [dr, dc] of dirShifts) {
      const cell = field[row + dr]?.[column + dc];
      if (cell === '.') newFrontier.add(row + dr + ',' + (column + dc));
    }
  }
  reachedPlots = newFrontier;
}
console.log(reachedPlots.size);
