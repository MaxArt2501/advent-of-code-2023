const seeds = input.slice(7, input.indexOf('\n\n')).split(' ').map(Number);
const maps = input.trim().slice(input.indexOf('\n\n') + 2).split('\n\n').map(
  block => block.split('\n').slice(1).map(line => line.split(' ').map(Number))
);

/** @type {[number, number][]} */
const seedRanges = Array.from(
  { length: seeds.length / 2 },
  (_, index) => seeds.slice(index * 2, index * 2 + 2)
);

/**
 * Transform a range into an array of subranges according to a given map
 * @param {[number, number]} range
 * @param {number[][]} map
 */
const splitRangesByMap = ([start, rangeLength], map) => {
  /** @type {[number, number][]} */
  const subRanges = [];
  let index = start;
  const rangeEnd = start + rangeLength;
  while (index < rangeEnd) {
    // We need to know if there's a mapping in the map that transforms the
    // starting index to another value, so we know there's a subrange that's
    // mapped to different values
    let mapping = map.find(([, source, length]) => source <= index && source + length > index);
    /** @type {[number, number]} */
    let subRange;
    if (mapping) {
      const end = Math.min(rangeEnd, mapping[1] + mapping[2]);
      // Subranges start with the index transformed by the mapping, so they're
      // ready for the next map
      subRange = [mapping[0] + index - mapping[1], end - index];
      index = end;
    } else {
      // If no such mapping has been found, we have a subrange that it's not
      // transformed. We need to know what's the length of this subrange, which
      // might end with the initial range's end
      const [, cEnd] = map.find(([, source]) => source > index && source < rangeEnd) ?? [0, rangeEnd];
      subRange = [index, cEnd - index];
      index = cEnd;
    }
    subRanges.push(subRange);
  }
  return subRanges;
}

// From 10 ranges I ended up with 130 ranges. How about you?
const locationRanges = maps.reduce(
  (sourceRanges, map) => sourceRanges.flatMap(range => splitRangesByMap(range, map)),
  seedRanges
);

const minLocation = Math.min(...locationRanges.map(([start]) => start));
console.log(minLocation);
