// Directions are mapped as 0 = North, 1 = East, 2 = South, 3 = West
// and are represented by a couple of row and column shifts
const dirShifts = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

/** @type {[string, number, number, 0|1|2|3]} */
let foo;

const getEnergizedCells = (
  /** @type {[number, number, 0|1|2|3]} */ start
) => {
  const map = input.trim().split('\n')
    // We keep the directions of the beams that passed through each cell
    // Keep in mind that each cell could be passed by multiple beams!
    .map((line) => line.split('').map((cell) => ({ cell, beams: new Set() })));
  let boxes = new Set([start]);
  while (boxes.size) {
    // After every iteration, we keep the number of active beams
    const newBoxes = new Set();
    for (const box of boxes) {
      const [row, columns, direction] = box;
      const [rowShift, colShift] = dirShifts[direction];
      const newRow = row + rowShift;
      const newCol = columns + colShift;
      if (
        newRow < 0 ||
        newRow >= map.length ||
        newCol < 0 ||
        newCol >= map[0].length
      ) continue;

      const { cell, beams } = map[newRow][newCol];
      // We've already been here, walking the same direction: no need to go on
      if (beams.has(direction)) continue;
      beams.add(direction);

      // We won't check if a beam with the same direction has already been
      // added: it would be removed in the next iteration thanks to the
      // previous `if` statement.
      if (
        cell === '.' ||
        // If it wasn't clear, `& 1` is my way to check parity
        (cell === '-' && direction & 1) ||
        (cell === '|' && !(direction & 1))
      ) {
        newBoxes.add([newRow, newCol, direction]);
      } else if (cell === '-' || cell === '|') {
        newBoxes.add([newRow, newCol, (direction + 3) & 3]);
        newBoxes.add([newRow, newCol, (direction + 1) & 3]);
      } else if (cell === '\\') {
        // The new direction might look odd, but it works!
        newBoxes.add([newRow, newCol, 3 - direction]);
      } else {
        // This, huh, works too. Check it out!
        newBoxes.add([newRow, newCol, (direction + 1 + 2 * (direction & 1)) & 3]);
      }
    }
    boxes = newBoxes;
  }

  return map.reduce(
    (sum, line) =>
      sum +
      line.reduce((partial, { beams }) => partial + Number(beams.size > 0), 0),
    0
  );
};
const energizedCells = getEnergizedCells([0, -1, 1]);
console.log(energizedCells);

const lineWidth = input.indexOf('\n');
const lineCount = input.trim().split('\n').length;
const starts = [
  ...Array.from({ length: lineWidth }, (_, column) => [lineCount, column, 0]),
  ...Array.from({ length: lineCount }, (_, row) => [row, -1, 1]),
  ...Array.from({ length: lineWidth }, (_, column) => [-1, column, 2]),
  ...Array.from({ length: lineCount }, (_, row) => [row, lineWidth, 3])
];
const maxEnergizedCells = Math.max(...starts.map(getEnergizedCells));
console.log(maxEnergizedCells);
