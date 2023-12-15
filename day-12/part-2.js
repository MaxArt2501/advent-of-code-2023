const REPEAT = 5;

const computeSlots = springs => Array.from(springs, (_, index) => {
  const slots = new Set();
  for (let diff = 0; index + diff < springs.length && springs[index + diff] !== '.'; diff++) {
    if (springs[index + diff + 1] !== '#') slots.add(diff + 1);
  }
  return slots;
});

const getRecord = (repeat) => line => {
  const [springs, values] = line.split(' ');
  const lengths = values.split(',').map(Number);
  const unfoldedSprings = Array(repeat).fill(springs).join('?');
  const unfoldedLengths = Array(repeat).fill(lengths).flat();
  return {
    springs: unfoldedSprings,
    lengths: unfoldedLengths,
    lastBlock: unfoldedSprings.lastIndexOf('#'),
    lengthSum: unfoldedLengths.reduce((sum, len) => sum + len + 1),
    slots: computeSlots(unfoldedSprings)
  };
};

const unfoldedRecords = input.trim().split('\n').map(getRecord(REPEAT));

// WARNING: this is still extremely slow. I hope I'll optimize it someday...
const countArrangements = ({ springs, lengths, slots, lengthSum, lastBlock }, index = 0) => {
  const [length, ...rest] = lengths;
  let count = 0;
  const limit = springs.indexOf('#', index) + 1 || springs.length + 1 - lengthSum;
  for (; index < limit; index++) {
    if (slots[index].has(length)) {
      if (rest.length) {
        count += countArrangements({
          springs,
          lengths: rest,
          lengthSum: lengthSum - length - 1,
          slots,
          lastBlock
        }, index + length + 1);
      } else if (index + length > lastBlock) count++;
    }
  }
  return count;
};

const totalArrangements = unfoldedRecords.reduce(
  (sum, record) => sum + countArrangements(record),
  0
);
console.log(totalArrangements);
