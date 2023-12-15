const records = input.trim().split('\n').map((line) => {
  const [raw, values] = line.split(' ');
  return {
    springs: raw.split(''),
    lengths: values.split(',').map(Number),
    questionMarks: Array.from(raw.matchAll(/\?/g), (match) => match.index),
  };
});

const countArrangements = (record) => {
  let count = 0;
  // The stupidest brute force has been used here... Don't @ me
  for (let n = 0; n < 1 << record.questionMarks.length; n++) {
    const copy = record.springs.slice();
    record.questionMarks.forEach((index, exp) => {
      copy[index] = n & (1 << exp) ? '#' : '.';
    });
    const sequences = Array.from(
      copy.join('').matchAll(/#+/g),
      ([sequence]) => sequence.length
    );
    if (
      sequences.length === record.lengths.length &&
      sequences.every((length, index) => record.lengths[index] === length)
    ) {
      count++;
    }
  }
  return count;
};

const totalArrangements = records.reduce((sum, record) => sum + countArrangements(record), 0);
console.log(totalArrangements);
