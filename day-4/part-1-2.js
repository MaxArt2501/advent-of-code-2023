const cards = input.trim().split('\n').map(line => ({
  winning: line.slice(line.indexOf(':') + 1, line.indexOf('|')).trim().split(/ +/).map(Number),
  numbers: line.slice(line.indexOf('|')).trim().split(/ +/).map(Number)
}));

const winningCounts = cards.map(
  ({ winning, numbers }) => numbers.filter(number => winning.includes(number)).length
);

const cardPoints = winningCounts.map(count => count ? 2 ** (count - 1) : 0);

const totalPoints = cardPoints.reduce((sum, points) => sum + points);
console.log(totalPoints);

const cardCounts = Array(cards.length).fill(1);
cardCounts.forEach((count, index) => {
  for (let cardShift = 0; cardShift < winningCounts[index]; cardShift++) {
    cardCounts[index + cardShift + 1] += count;
  }
});

const totalCards = cardCounts.reduce((sum, count) => sum + count);
console.log(totalCards);
