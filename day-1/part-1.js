const lines = input.trim().split('\n');

const total = lines.reduce((sum, line) => {
  const first = line.match(/^\D*(\d)/)[1];
  const last = line.match(/(\d)\D*$/)[1];
  return sum + Number(first + last);
}, 0);

console.log(total);
