const patterns = input.trim().split('\n\n').map((block) => block.split('\n'));

// We don't find matching columns. We find matching rows in the transposed
// pattern!
const transposePattern = (pattern) =>
  Array.from(pattern[0], (_, index) =>
    pattern.map((line) => line[index]).join('')
  );

const findMirror = (pattern) =>
  pattern.slice(0, -1).findIndex((_, index) =>
    pattern
      .slice(index + 1, (index + 1) * 2)
      .every((row, diff) => row === pattern[index - diff])
  ) + 1;

const getPatternValue = (pattern) => findMirror(pattern) * 100 || findMirror(transposePattern(pattern));
const totalValue = patterns.reduce((sum, pattern) => sum + getPatternValue(pattern), 0);
