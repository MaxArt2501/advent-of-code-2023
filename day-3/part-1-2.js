const lineLength = input.indexOf('\n');
const emptyLine = '.'.repeat(lineLength) + '\n';

const numbers = Array.from(input.matchAll(/\d+/g));

const symbolRegex = /[^.\n]/;

/**
 * Returns the index (inside `input`) of the symbol nearby the given match.
 * There should only be one for every number - at least in my input - but
 * it's not clear from the text.
 * @param {RegExpMatchArray} match
 */
const getSymbolIndex = match => {
  if (symbolRegex.test(input.charAt(match.index - 1))) {
    return match.index - 1;
  }
  if (symbolRegex.test(input.charAt(match.index + match[0].length))) {
    return match.index + match[0].length;
  }
  let index = input.slice(
    match.index + lineLength,
    match.index + lineLength + match[0].length + 2
  ).search(symbolRegex);
  if (index >= 0) {
    return match.index + lineLength + index;
  }

  index = (emptyLine + input).slice(
    match.index - 1,
    match.index + match[0].length + 1
  ).search(symbolRegex);
  if (index >= 0) {
    return match.index - lineLength - 1 + index;
  }

  return -1;
};

const parts = numbers.filter(number => getSymbolIndex(number) >= 0);
const totalPartNumbers = parts.reduce((sum, part) => sum + Number(part[0]), 0);
console.log(totalPartNumbers);

/**
 * We identify a gear with its `input` index, and associate it with the value
 * of the parts that it's near to.
 * @type {Record<number, number[]>}
 */
const gearMap = parts.reduce((map, part) => {
  const index = getSymbolIndex(part);
  if (input[index] === '*') {
    if (index in map) map[index].push(part[0]);
    else map[index] = [part[0]];
  }
  return map;
}, {});

// Then we filter out those that don't have exactly two parts nearby
const gears = Object.values(gearMap).filter(list => list.length === 2);
const totalGearPower = gears.reduce((sum, [first, last]) => sum + first * last, 0);
console.log(totalGearPower);
