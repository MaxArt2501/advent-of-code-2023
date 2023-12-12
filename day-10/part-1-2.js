const lineWidth = input.indexOf('\n') + 1;

// Iterator that returns the path of a pipe
function* getPath(start) {
  let position = /[F|7]/.test(input.charAt(start - lineWidth))
      ? start - lineWidth
      : /[J\-7]/.test(input.charAt(start + 1))
      ? start + 1
      : /[J|L]/.test(input.charAt(start + lineWidth))
      ? start + lineWidth
      : /[L\-F]/.test(input.charAt(start - 1))
      ? start - 1
      : start,
    previous = start;
  while (position !== start) {
    yield position;
    let oldPosition = position;
    if (input[position] === '|')
      position =
        position + lineWidth === previous
          ? position - lineWidth
          : position + lineWidth;
    else if (input[position] === '-')
      position = position + 1 === previous ? position - 1 : position + 1;
    else if (input[position] === '7')
      position =
        position + lineWidth === previous ? position - 1 : position + lineWidth;
    else if (input[position] === 'F')
      position =
        position + lineWidth === previous ? position + 1 : position + lineWidth;
    else if (input[position] === 'J')
      position =
        position - lineWidth === previous ? position - 1 : position - lineWidth;
    else
      position =
        position - lineWidth === previous ? position + 1 : position - lineWidth;
    previous = oldPosition;
  }
  yield start;
}

const path = Array.from(getPath(input.indexOf('S')));
console.log(path.length / 2);

// We need to know what junction is actually `S`. In my case, it's a `|`.
// A word to the wise: it works for my input, but I haven't tested any other 😅
const junctionMap = {
  '1,1': '-',
  [`${lineWidth},${lineWidth}`]: '|',
  [`${lineWidth},1`]: 'L',
  [`${lineWidth},-1`]: 'J',
  [`1,${lineWidth},1`]: 'F',
  [`-1,${lineWidth},-1`]: '7',
};
const startJunction =
  junctionMap[`${path.at(-1) - path.at(0)},${path.at(-2) - path.at(-1)}`];

// This is just the input with the `S` cell replaced with the corresponding
// junction, and other pipes removed.
const cleanField = Array.from(input, (char, index) =>
  char === 'S'
    ? startJunction
    : char === '\n' || path.includes(index)
    ? char
    : '.'
).join('');

/*
 * Here comes the topological trick: a point is inside a closed path if *any*
 * straight line that starts from the point and goes outside crosses the path
 * an odd amount of times (tangent points don't count).
 * This could be translated to how many times we're crossing the pipe from the
 * cell to the end of the line. In this case, a vertical pipe `|` is an obvious
 * crossing, but also other combinations like `L--7` or `F-J` are fine. So
 * we'll use a regex to split the substring, and count the separated chunks.
 */
const reSplitter = /\||F-*J|L-*7/;
const isInside = (index) => {
  if (cleanField[index] !== '.') return false;
  const subLine = cleanField.slice(index + 1, cleanField.indexOf('\n', index));
  return (subLine.split(reSplitter).length & 1) === 0;
};

const insideCells = Array.from(cleanField.matchAll(/\./g)).filter(({ index }) =>
  isInside(index)
);
console.log(insideCells.length);
