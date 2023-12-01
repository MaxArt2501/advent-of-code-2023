const lines = input.trim().split('\n');

// I'm a bad person...
const reverse = string => string.split('').reverse().join('');
const letterDigits = ['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const reversedDigits = letterDigits.map(reverse);
const firstLetterDigitMatcher = /(\d|one|two|three|four|five|six|seven|eight|nine)/;
const lastLetterDigitMatcher = /(\d|enin|thgie|neves|xis|evif|ruof|eerht|owt|eno)/;

const total = lines.reduce((sum, line) => {
  const firstDigitMatch = line.match(firstLetterDigitMatcher)[1];
  const first = isNaN(firstDigitMatch) ? letterDigits.indexOf(firstDigitMatch) + 1 : firstDigitMatch;

  // So, so bad... This is quite inefficient, but I'm doing it anyway because it's efficient enough...
  const lastDigitMatch = reverse(line).match(lastLetterDigitMatcher)[1];
  const last = isNaN(lastDigitMatch) ? reversedDigits.indexOf(lastDigitMatch) + 1 : lastDigitMatch;
  return sum + Number(String(first) + String(last));
}, 0);

console.log(total);
