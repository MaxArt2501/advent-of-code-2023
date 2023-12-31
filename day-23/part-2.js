// Directions are mapped as 0 = Up, 1 = Right, 2 = Down, 3 = Left and are
// represented by a couple of row and column shifts (see also day 16-18, 21)
const dirShifts = [
  [-1, 0],
  [0, 1],
  [1, 0],
  [0, -1],
];

/** @typedef {`${number},${number}`} Coords  */
/** @typedef {`${Coords} ${Coords}`} LinkRef  */

/**
 * Convert the input in a weighted graph
 * @param {string} input
 */
const buildGraph = (input) => {
  const mazeWidth = input.indexOf('\n');

  /**
   * Maps a link to its length
   * @type {Record<LinkRef, number>}
   */
  const links = {};
  // The initial point is the first node
  let nodeFrontier = new Set(['0,1']);
  const visited = new Set(nodeFrontier);
  /** @type {Set<Coords>} */
  const nodes = new Set(nodeFrontier);

  /** Return the list of adjacent position to the given coordinates, minus
   * the cell of provenience (if given). Useful to determine the next cell in a
   * corridor */
  const getAdjacentPositions = (row, column, fromRow, fromCol) =>
    // Using .flatMap as combining .filter + .map
    dirShifts.flatMap((shift) => {
      const newRow = row + shift[0];
      const newCol = column + shift[1];
      return (
        (newRow !== fromRow || newCol !== fromCol) &&
        newRow >= 0 &&
        newRow < mazeWidth &&
        newCol >= 0 &&
        newCol < mazeWidth &&
        input[newRow * (mazeWidth + 1) + newCol] === '.'
      ) ? [[newRow, newCol]] : [];
    });

  // A common breadth-first search
  while (nodeFrontier.size) {
    const newFrontier = new Set();
    for (const linkStart of nodeFrontier) {
      const [row, column] = linkStart.split(',').map(Number);
      // From the node, we get the adjacent empty cells.
      const linkFirstSteps = getAdjacentPositions(row, column);

      for (let [nextRow, nextCol] of linkFirstSteps) {
        const newPosition = nextRow + ',' + nextCol;
        if (visited.has(newPosition)) continue;

        let fromRow = row;
        let fromCol = column;
        let nextPositions;
        // Starting with 1 because we've already done the first step :)
        let length = 1;
        // Pardon the long line... It basically says that we can go on while
        // there's a single empty cell ahead. If there are zero, it's either a
        // dead end or the exit; if there are more than one, it's another node,
        // so this sub-path has ended.
        while ((nextPositions = getAdjacentPositions(nextRow, nextCol, fromRow, fromCol)).length === 1) {
          visited.add(nextRow + ',' + nextCol);
          length++;
          fromRow = nextRow;
          fromCol = nextCol;
          ([[ nextRow, nextCol ]] = nextPositions);
        }
        const linkEnd = nextRow + ',' + nextCol;
        // Dead ends and the exit are stored as nodes as well
        if (!nodes.has(linkEnd)) {
          nodes.add(linkEnd);
          newFrontier.add(linkEnd);
        }
        // Sorting the ends because the link orientation is not meaningful
        links[[linkStart, linkEnd].sort().join(' ')] = length;
      }
    }
    nodeFrontier = newFrontier;
  }
  return { nodes, links };
};

const computeMaxPath = (input) => {
  const mazeWidth = input.indexOf('\n');
  const exitNode = `${mazeWidth - 1},${mazeWidth - 2}`;
  const { nodes, links } = buildGraph(input);
  const linkEntries = Object.entries(links).map(([name, length]) => [new Set(name.split(' ')), length]);
  // For every node, map it to the adjacent nodes
  const nearbyNodes = [...nodes].reduce((map, node) => {
    const nodeSet = new Set([node]);
    const departingLinks = linkEntries.filter(([ends]) => ends.has(node));
    map[node] = departingLinks.map(([ends, length]) => [...ends.difference(nodeSet), length]);
    return map;
  }, {});

  /**
   * We need to know the nodes we've already visited, and keep the total so far
   * because we don't want to compute it at every step.
   * @type {Set<{ node: Coords, path: Set<Coords>, total: number }>}
   */
  let frontier = new Set([{ node: '0,1', path: new Set(['0,1']), total: 0 }]);
  let maxPath = 0;
  // Now we need to find the longest possible path. I don't know why I used
  // breadth-first again, as depth-first would have been maybe more intuitive.
  // But not faster anyway, so...
  while (frontier.size) {
    const newFrontier = new Set();
    for (const { node, path, total } of frontier) {
      for (const [nextNode, length] of nearbyNodes[node]) {
        if (path.has(nextNode)) continue;
        const newEntry = {
          node: nextNode,
          path: path.union(new Set([nextNode])),
          total: total + length
        };
        if (nextNode === exitNode) {
          maxPath = Math.max(maxPath, newEntry.total);
        } else newFrontier.add(newEntry);
      }
    }
    frontier = newFrontier;
  }
  return maxPath;
};

// Not very fast, but does its job
console.log(computeMaxPath(buildGraph(input.replace(/[\^>v<]/g, '.'))));
