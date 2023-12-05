const seeds = input.slice(7, input.indexOf('\n\n')).split(' ').map(Number);
const maps = input.trim().slice(input.indexOf('\n\n') + 2).split('\n\n').map(
  block => block.split('\n').slice(1).map(line => line.split(' ').map(Number))
);

/**
 * @param {number} value
 * @param {number[][]} map
 */
const mapValue = (value, map) => {
  for (const [destination, source, length] of map)
    if (value >= source && value < source + length)
      return destination + value - source;
  return value;
};

const seedLocations = seeds.map(seed => maps.reduce(mapValue, seed));
console.log(Math.min(...seedLocations));
