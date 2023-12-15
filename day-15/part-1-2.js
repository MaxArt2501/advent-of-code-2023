const chunks = input.trim().split(',');

const hash = (string) =>
  new TextEncoder().encode(string)
    .reduce((value, code) => ((value + code) * 17) & 255, 0);

const totalCheck = chunks.reduce((sum, chunk) => sum + hash(chunk), 0);
console.log(totalCheck);

const boxes = Array.from({ length: 256 }, () => []);
for (const chunk of chunks) {
  const [lens, type, focal] = chunk.split(/([=-])/);
  const box = boxes[hash(lens)];
  const index = box.findIndex(([code]) => code === lens);
  if (type === '-') {
    if (index >= 0) box.splice(index, 1);
  } else {
    box[index >= 0 ? index : box.length] = [lens, focal];
  }
}

const totalFocusingPower = boxes.reduce(
  (sum, box, index) =>
    sum + (index + 1) *
      box.reduce((partial, [, length], slot) => partial + (slot + 1) * length, 0),
  0
);
console.log(totalFocusingPower);
