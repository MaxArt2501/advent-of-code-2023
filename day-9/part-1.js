const sequences = input.trim().split('\n').map(
  line => line.split(' ').map(Number)
);

const getNext = sequence => {
  const diffSeqs = [];
  let currentSeq = sequence;
  // `Boolean` transforms truthy values to true, falsy to false
  while (currentSeq.some(Boolean)) {
    diffSeqs.push(currentSeq);
    // Every sequence of differences is one element shorter than the previous
    currentSeq = Array.from(
      { length: currentSeq.length - 1},
      (_, index) => currentSeq[index + 1] - currentSeq[index]
    );
  }
  // I kind of forgot that `reduceRight` exists...
  return diffSeqs.reduceRight((sum, seq) => sum + seq.at(-1), 0);
};

const totalNextValues = sequences.map(getNext).reduce((sum, value) => sum + value);
console.log(totalNextValues);
