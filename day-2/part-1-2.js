const colors = ['red', 'green', 'blue'];
const limits = [12, 13, 14];

// A lot of splitting, here...
const games = input.trim().split('\n').map(line => {
  const id = Number(line.slice(5, line.indexOf(':')));
  const sets = line.slice(line.indexOf(':') + 2).split('; ').map(setString => {
    const extractions = setString.split(', ').map(cubeCount => cubeCount.split(' '));
    const colorCount = [0, 0, 0];
    for (const [count, color] of extractions) {
      colorCount[colors.indexOf(color)] = Number(count);
    }
    return colorCount;
  });
  return { id, sets };
});

const possibleGames = games.filter(({ sets }) =>
  sets.every(counts => counts.every(
    (count, index) => count <= limits[index])
  )
);

const possibleIdSum = possibleGames.reduce((sum, { id }) => sum + id, 0);

console.log(possibleIdSum);

const gameMinPowers = games.map(({ sets }) => {
  const [red, green, blue] = [0, 0, 0].map((_, index) => Math.max(...sets.map(set => set[index])));
  return red * green * blue;
});

const powerSum = gameMinPowers.reduce((sum, power) => sum + power);

console.log(powerSum);
