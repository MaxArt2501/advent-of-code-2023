const getWorkflows = (input) =>
  input.slice(0, input.indexOf('\n\n')).split('\n').reduce((map, line) => {
    const [name, rest] = line.split('{');
    const chunks = rest.slice(0, -1).split(',');
    const branches = chunks.slice(0, -1).map((chunk) => {
      const prop = chunk[0];
      const operator = chunk[1];
      const value = Number(chunk.slice(2, chunk.indexOf(':')));
      const destination = chunk.slice(chunk.indexOf(':') + 1);
      return { prop, operator, value, destination };
    });
    const elseDest = chunks.at(-1);
    map[name] = { branches, elseDest };
    return map;
  }, {});

const workflows = getWorkflows(input);

const neg = { '<': '>=', '>': '<=' };
/**
 * Compute all constraint series that yield an acceptable part, if satisfied
 * @param {Record<string, { branches: Array, elseDest: string }>} workflows
 * @returns
 */
const computePaths = (workflows) => {
  let frontier = new Map([['in', []]]);
  const acceptableConstraints = [];

  while (frontier.size) {
    const newFrontier = new Map();
    for (const [name, constraints] of frontier) {
      const { branches, elseDest } = workflows[name];
      const prevConstraints = [...constraints];
      for (const { prop, operator, value, destination } of branches) {
        if (destination === 'A') {
          acceptableConstraints.push([
            ...prevConstraints,
            { prop, operator, value },
          ]);
        } else if (destination !== 'R') {
          // It helps that any workflow can be reached from *at most* one
          // other workflow (some workflows cannot be reached at all)
          newFrontier.set(destination, [
            ...prevConstraints,
            { prop, operator, value },
          ]);
        }
        prevConstraints.push({ prop, operator: neg[operator], value });
      }
      if (elseDest === 'A') {
        acceptableConstraints.push(prevConstraints);
      } else if (elseDest !== 'R') {
        newFrontier.set(elseDest, prevConstraints);
      }
    }
    frontier = newFrontier;
  }

  return acceptableConstraints;
};

const MAX_VALUE = 4000;
const getConstrainedRanges = (constraints) => {
  const ranges = { x: [1, MAX_VALUE], m: [1, MAX_VALUE], a: [1, MAX_VALUE], s: [1, MAX_VALUE] };
  for (const { prop, operator, value } of constraints) {
    const [start, end] = ranges[prop];
    if (operator === '<') ranges[prop] = [start, Math.min(end, value - 1)];
    else if (operator === '<=') ranges[prop] = [start, Math.min(end, value)];
    else if (operator === '>') ranges[prop] = [Math.max(start, value + 1), end];
    else if (operator === '>=') ranges[prop] = [Math.max(start, value), end];
  }
  return ranges;
};

const getRangesCombinations = (ranges) =>
  Object.values(ranges)
    .map(([start, end]) => end + 1 - start)
    .reduce((product, value) => product * value);

const totalCombinations = computePaths(workflows)
  .map(getConstrainedRanges)
  .map(getRangesCombinations)
  .reduce((sum, value) => sum + value);

console.log(totalCombinations);
