// Directions are mapped as 0 = Up, 1 = Right, 2 = Down, 3 = Left and are
// represented by a couple of row and column shifts (see also day 16-18, 21)
const dirShifts = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

const dirSlopes = '^>v<';

// Usual breadt-first search. Yes, it's slow. But completes in a minute or so.
// NB: I'm not sure this is correct in the general case, but it worked on mine.
const computeMaxPath = (input) => {
  const mazeWidth = input.indexOf('\n');
  let frontier = [['0,1', new Set(['0,1'])]];
  let maxPath = 0;
  const maxReachMap = {};
  while (frontier.length) {
    const newFrontier = [];
    for (const [position, path] of frontier) {
      const [row, column] = position.split(',').map(Number);
      dirShifts.forEach((shift, dir) => {
        const newRow = row + shift[0];
        const newCol = column + shift[1];
        if (newRow === mazeWidth - 1 && newCol === mazeWidth - 2) {
          if (maxPath < path.size) maxPath = path.size;
          return;
        }
        if (newRow < 0 || newRow >= mazeWidth || newCol < 0 || newCol >= mazeWidth) return;
        const cell = input[newRow * (mazeWidth + 1) + newCol];
        if (cell === '#' || (cell !== '.' && cell !== dirSlopes[dir])) return;
        const newPosition = newRow + ',' + newCol;
        if (!path.has(newPosition) && !(maxReachMap[newPosition] > path.size)) {
          maxReachMap[newPosition] = path.size;
          newFrontier.push([newPosition, new Set([...path, newPosition])]);
        }
      });
    }
    frontier = newFrontier;
  }
  return maxPath;
};

console.log(computeMaxPath(input));
