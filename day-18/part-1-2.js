// Directions are mapped as 0 = Up, 1 = Right, 2 = Down, 3 = Left and are
// represented by a couple of row and column shifts (see also day 16 and 17)
const dirShifts = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const getInstruction1 = (input) =>
  input.trim().split('\n').map((line) => {
    const [dir, len] = line.split(' ');
    return ['URDL'.indexOf(dir), Number(len)];
  });

const getInstruction2 = (input) =>
  input.trim().split('\n').map((line) => {
    const [, , inst] = line.split(' ');
    return [Number(inst[7]), Number('0x' + inst.slice(2, -2))];
  });

  /**
   * This is going to use Gauss' shoelace formula for computing the area of a
   * polygon, but the points need to be adjusted. In fact, using instructions
   * like `R 2`, `D 2`, `L 2`, `U 2` and starting at (0, 0), we end up with
   * (0, 2), (2, 2) and (2, 0) as the other 3 vertexes, but shoelace's formula
   * will yield an area of 4 instead of 9, which would be correct in our case.
   * @param {Array<[0|1|2|3, number]>} instructions
   */
const computeTrenchSize = (instructions) => {
  /**
   * We count the number of clockwise 90° turns. If the number is greater than
   * the counter-clockwise turns, then the polygon's border is walked
   * clockwise (the difference should be a multiple of 4). We need to know this
   * in order to make the correct adjustments to the polygon's vertexes.
   */
  const clockwiseTurns = instructions.filter(([direction], index) =>
    [1, -3].includes(
      instructions[(index + 1) % instructions.length][0] - direction
    )
  ).length;
  const isClockwise = clockwiseTurns > instructions.length / 2;

  const parity = isClockwise ? -1 : 1;
  // We need to know what turn we're doing and the overall direction to adjust
  // the vertex coordinates in order to use them in shoelace's formula.
  const getCoordsAdjust = (dir, nextDir) => {
    const dr = dirShifts[dir][0] + dirShifts[nextDir][0];
    const dc = dirShifts[dir][1] + dirShifts[nextDir][1];
    return [(dc + parity) / 2 / parity, (dr - parity) / -2 / parity];
  };

  let row = 0;
  let column = 0;
  const coords = [];
  instructions.forEach(([direction, distance], index) => {
    const nextDir = instructions[(index + 1) % instructions.length][0];
    const coordAdjust = getCoordsAdjust(direction, nextDir);
    row += dirShifts[direction][0] * distance;
    column += dirShifts[direction][1] * distance;
    coords.push([row + coordAdjust[0], column + coordAdjust[1]]);
  });

  // Gauss' shoelace area formula
  return Math.abs(coords.reduce((sum, [row, col], index) => {
    const [nextRow, nextCol] = coords[(index + 1) % coords.length];
    return sum + row * nextCol - col * nextRow;
  }, 0)) / 2;
};

console.log(computeTrenchSize(getInstruction1(input)));
console.log(computeTrenchSize(getInstruction2(input)));
