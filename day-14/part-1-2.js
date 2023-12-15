/**
 * @param {string} rawPlatform
 * @returns {Cell[][]}
 */
const makePlatform = rawPlatform => rawPlatform.trim().split('\n').map(line => line.split(''));

/** @typedef {('.' | 'O' | '#')} Cell */

/**
 * Tilt the platform towards the North.
 * ATTENTION: this function, just like the similar `tiltWest`, `tiltSouth`
 * and `tiltEast`, *mutates* the input argument.
 * @param {Cell[][]} platform
 */
const tiltNorth = platform => {
  platform.forEach((line, row) => {
    line.forEach((cell, column) => {
      if (cell === 'O') {
        let newRow = row - 1;
        while (newRow >= 0 && platform[newRow][column] === '.') newRow--;
        if (newRow < row - 1) {
          platform[newRow + 1][column] = 'O';
          platform[row][column] = '.';
        }
      }
    });
  });
  return platform;
};

/** @param {Cell[][]} platform */
const computeTotalLoad = platform => platform.flatMap(
  (line, row) => line.map(cell => cell === 'O' ? platform.length - row : 0)
).reduce((sum, value) => sum + value);

console.log(computeTotalLoad(tiltNorth(makePlatform(input))));

/** @param {Cell[][]} platform */
const tiltWest = platform => {
  platform.forEach((line) => {
    line.forEach((cell, column) => {
      if (cell === 'O') {
        let newColumn = column - 1;
        while (newColumn >= 0 && line[newColumn] === '.') newColumn--;
        if (newColumn < column - 1) {
          line[newColumn + 1] = 'O';
          line[column] = '.';
        }
      }
    });
  });
  return platform;
};

/** @param {Cell[][]} platform */
const tiltSouth = platform => {
  for (let row = platform.length - 1; row >= 0; row--) {
    const line = platform[row];
    line.forEach((cell, column) => {
      if (cell === 'O') {
        let newRow = row + 1;
        while (newRow < platform.length && platform[newRow][column] === '.') newRow++;
        if (newRow > row + 1) {
          platform[newRow - 1][column] = 'O';
          platform[row][column] = '.';
        }
      }
    });
  }
  return platform;
};

/** @param {Cell[][]} platform */
const tiltEast = platform => {
  platform.forEach((line) => {
    for (let column = line.length - 1; column >= 0; column--) {
      if (line[column] === 'O') {
        let newColumn = column + 1;
        while (newColumn < line.length && line[newColumn] === '.') newColumn++;
        if (newColumn > column + 1) {
          line[newColumn - 1] = 'O';
          line[column] = '.';
        }
      }
    }
  });
  return platform;
};

/** @param {Cell[][]} platform */
const roll = platform => tiltEast(tiltSouth(tiltWest(tiltNorth(platform))));

/** @param {Cell[][]} platform */
const serialize = platform => platform.map(line => line.join('')).join('\n');

const platformHistory = [];
const platform = makePlatform(input);
const CYCLES = 1e9;
let platformIndex;

/**
 * Of course we cannot count to one billion. So we have to compute the
 * billionth platform state somehow. Rolling the platform repeatedly will
 * eventually lead to a cycle of states: we need to know when it begins, and
 * what are the states of the cycle.
 */
for (let count = 0; count < CYCLES; count++) {
  const rawPlatform = serialize(roll(platform));
  platformIndex = platformHistory.indexOf(rawPlatform);
  // We've already been in this state: this means we're found our state cycle!
  if (platformIndex >= 0) break;
  platformHistory.push(rawPlatform);
}

const platformCycleLength = platformHistory.length - platformIndex;
// So this is the billionth state. Trust me bro.
const lastPlatform = platformHistory[
  platformIndex + ((CYCLES - platformIndex) % platformCycleLength) - 1
];
console.log(computeTotalLoad(makePlatform(lastPlatform)));
