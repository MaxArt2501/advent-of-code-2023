const patterns = input.trim().split('\n\n').map((block) => block.split('\n'));

const transposePattern = (pattern) =>
  Array.from(pattern[0], (_, index) =>
    pattern.map((line) => line[index]).join('')
  );

// This checks if two lines differ for just a character
const haveSmudge = (line1, line2) => {
  for (let index = 0; index < line1.length; index++) {
    if (line1[index] !== line2[index]) {
      return line1.slice(index + 1) === line2.slice(index + 1);
    }
  }
  return false;
};

const findSmudgedMirror = (pattern) => {
  for (let index = 0; index < pattern.length - 1; index++) {
    const limit = Math.min(index + 1, pattern.length - 1 - index);
    let hasSmudge = false;
    let mirrored = true;
    for (let diff = 0; diff < limit; diff++)
      if (pattern[index + 1 + diff] !== pattern[index - diff])
        if (!hasSmudge && haveSmudge(pattern[index + 1 + diff], pattern[index - diff])) {
          hasSmudge = true;
        } else {
          mirrored = false;
          break;
        }
    if (mirrored && hasSmudge) return index + 1;
  }
  return 0;
};

const getSmudgedPatternValue = (pattern) =>
  findSmudgedMirror(pattern) * 100 ||
  findSmudgedMirror(transposePattern(pattern));
const totalSmudgedValue = patterns.reduce(
  (sum, pattern) => sum + getSmudgedPatternValue(pattern),
  0
);
