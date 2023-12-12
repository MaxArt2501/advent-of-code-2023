const lines = input.trim().split('\n');

const galaxies = lines.flatMap((line, row) =>
  Array.from(line.matchAll(/#/g), ({ index }) => [row, index])
);

const emptyColumns = lines[0].split('')
  .flatMap((_, index) =>
    lines.every((line) => line[index] === '.') ? [index] : []
  );

const lineWidth = input.indexOf('\n') + 1;
const emptyRows = Array.from(
  input.matchAll(/(?:^|\n)\.+(?=\n|$)/g),
  ({ index }) => (index + 1) / lineWidth
);

// At first, I just doubled the empty rows and columns. But this works for both
// parts, so there.
const expandGalaxies = (amount) =>
  galaxies.map(([row, column]) => {
    const emptyRowsBefore = emptyRows.findLastIndex((r) => r < row) + 1;
    const emptyColsBefore =
      emptyColumns.findLastIndex((col) => col < column) + 1;
    return [
      row + emptyRowsBefore * amount,
      column + emptyColsBefore * amount,
    ];
  });

const getTotalDistance = (galaxies) =>
  galaxies.reduce((sum, [row, column]) =>
    sum + galaxies.reduce(
      (subSum, [otherRow, otherCol]) =>
        // This is the usual taxi-driver distance
        subSum + Math.abs(row - otherRow) + Math.abs(column - otherCol),
      0),
    0) / 2; // Because we've counted the distances twice

console.log(getTotalDistance(expandGalaxies(1)));
console.log(getTotalDistance(expandGalaxies(999999)));
