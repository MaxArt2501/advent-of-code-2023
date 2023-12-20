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

/**
 * @param {string} input
 * @returns {Array<{ x: number, m: number, a: number, s: number }>}
 */
const getParts = (input) =>
  input.slice(input.indexOf('\n\n') + 2).trim().split('\n').map((line) =>
    JSON.parse(line.replace(/([{,])/g, '$1"').replaceAll('=', '":'))
  );

const parts = getParts(input);

const isAcceptable = (part) => {
  let workflowName = 'in';
  while (workflowName !== 'A' && workflowName !== 'R') {
    const { branches, elseDest } = workflows[workflowName];
    workflowName = elseDest;
    for (const { prop, operator, value, destination } of branches) {
      if (
        (operator === '<' && part[prop] < value) ||
        (operator === '>' && part[prop] > value)
      ) {
        workflowName = destination;
        break;
      }
    }
  }
  return workflowName === 'A';
};

const getPartValue = (part) => Object.values(part).reduce((sum, value) => sum + value);
const totalPartValue = parts.filter(isAcceptable).reduce((sum, part) => sum + getPartValue(part), 0);
console.log(totalPartValue);
