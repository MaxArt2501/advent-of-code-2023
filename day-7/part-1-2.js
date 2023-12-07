const hands = input.trim().split('\n').map(line => {
  const [hand, stringBid] = line.split(' ');
  return { hand, bid: Number(stringBid) };
});
const cardOrder = '23456789TJQKA';
const typeChecks = [
  /(.)\1{4}/,                // 5-of-a-kind,
  /(.)\1{3}/,                // 4-of-a-kind,
  /^(.)\1{1,2}(.)\2{1,2}$/,  // full house
  /(.)\1\1/,                 // 3-of-a-kind,
  /(.)\1.?(.)\2/,            // two pair
  /(.)\1/,                   // one pair
  /(.)/,                     // high card
];

/** @param {string} hand */
const getHandType = hand => {
  const sortedHand = hand.split('').sort().join('');
  return typeChecks.findIndex(check => check.test(sortedHand));
};
const compareHands = (hand1, hand2) => {
  const typeDiff = getHandType(hand2.hand) - getHandType(hand1.hand);
  if (typeDiff) return typeDiff;
  for (let index = 0; index < hand1.hand.length; index++) {
    const card1 = hand1.hand[index];
    const card2 = hand2.hand[index];
    const cardDiff = cardOrder.indexOf(card1) - cardOrder.indexOf(card2);
    if (cardDiff) return cardDiff;
  }
  return 0;
};
const getTotalWinnings = hands => hands.reduce((sum, hand, index) => sum + hand.bid * (index + 1), 0);

/**
 * `toSorted` is available in Chrome/Edge 110+, Firefox 115+, Safari 16.0+, Node 20+
 * Otherwise replace with `[...hands].sort(...)`.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/toSorted}
 */
const sortedHands = hands.toSorted(compareHands);
console.log(getTotalWinnings(sortedHands));

const variantCardOrder = 'J23456789TQKA';

/**
 * Replace the joker cards with the most convenient one, i.e. the card that's
 * most present in the hand.
 * @param {string} hand
 */
const replaceJokers = hand => {
  // Chose aces, but it's indifferent. This check is also unnecessary, as the
  // function would return 'undefined' 5 times, and that would be recognized as
  // a 5-of-a-kind by `getHandType` anyway. But it'd be quirky.
  if (hand === 'JJJJJ') return 'AAAAA';
  // Map cards to their occurences in the hand
  const nonJokerCards = hand.split('').reduce((map, card) => {
    if (card !== 'J') {
      if (card in map) map[card]++;
      else map[card] = 1;
    }
    return map;
  }, {});
  const mostPresentCount = Math.max(...Object.values(nonJokerCards));
  const mostPresentCard = Object.keys(nonJokerCards).find(
    card => nonJokerCards[card] === mostPresentCount
  );
  return hand.replaceAll('J', mostPresentCard);
};

const variantCompareHands = (hand1, hand2) => {
  // Now we have to replace the jokers...
  const typeDiff = getHandType(replaceJokers(hand2.hand)) - getHandType(replaceJokers(hand1.hand));
  if (typeDiff) return typeDiff;
  for (let index = 0; index < hand1.hand.length; index++) {
    const card1 = hand1.hand[index];
    const card2 = hand2.hand[index];
    // ... and use the variant card order.
    const cardDiff = variantCardOrder.indexOf(card1) - variantCardOrder.indexOf(card2);
    if (cardDiff) return cardDiff;
  }
  return 0;
};
const variantSortedHands = hands.toSorted(variantCompareHands);
console.log(getTotalWinnings(variantSortedHands));
