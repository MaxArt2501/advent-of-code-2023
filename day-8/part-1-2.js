const [moves, rawNodes] = input.trim().split('\n\n');
const nodes = rawNodes.split('\n').reduce((nodeMap, line) => {
  nodeMap[line.slice(0, 3)] = [line.slice(7, 10), line.slice(12, 15)];
  return nodeMap;
}, {});

const countMoves = start => {
  let count = 0;
  let current = start;
  // A bit of a spoiler for part 2...
  while (current[2] !== 'Z') {
    const move = moves[count % moves.length];
    current = nodes[current][move === 'R' ? 1 : 0];
    count++;
  }
  return count;
}

console.log(countMoves('AAA'));

/* This requires a bit of explanation. The fact that there are as many nodes
 * that end with an 'A' than nodes that end with a 'Z' suggests that each
 * ghost starting node ends to a different 'Z' node. */
const ghostStarts = Object.keys(nodes).filter(node => node[2] === 'A');
const ghostPathLengths = ghostStarts.map(countMoves);
/* Now here's the kicker. There are three distinct facts that hugely simplify
 * the second part:
 * - after reaching the 'Z' node, the cycle with continue with the first node
 *   after the starting node, and
 * - the length of such path is divisible by the length of the move sequence,
 *   which is a prime number (283 in my case)
 * - and finally, the only other divisor is a prime number itself!
 * In the end, we have the cycle length right away, and we don't need to create
 * a "least common multiple" function to know when the cycles will be synced
 * again, since we can just multiply all those primes together.
 * (Let me know if it doesn't happen in your case too.) */
const syncedGhostCycleLength = ghostPathLengths
  .reduce((prod, length) => prod * length / moves.length, 1)
  * moves.length;
console.log(syncedGhostCycleLength);
