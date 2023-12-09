const sequences = input.trim().split('\n').map(
  line => line.split(' ').map(Number)
);

// This is basically the same of `getNext` from the previous part, with just
// the `reduceRight` callback changed. I *could* have created a generic
// function for both parts, but eh, this is clearer.
const getPrevious = sequence => {
  const diffSeqs = [];
  let currentSeq = sequence;
  while (currentSeq.some(Boolean)) {
    diffSeqs.push(currentSeq);
    currentSeq = Array.from(
      { length: currentSeq.length - 1},
      (_, index) => currentSeq[index + 1] - currentSeq[index]
    );
  }
  return diffSeqs.reduceRight((sum, seq) => seq[0] - sum, 0);
};

const totalNextValues = sequences.map(getPrevious).reduce((sum, value) => sum + value);
console.log(totalNextValues);
