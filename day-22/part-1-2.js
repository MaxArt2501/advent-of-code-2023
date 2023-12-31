const bricks = input.trim().split('\n').map(
  (line) => line.split('~').map((part) => part.split(',').map(Number))
);

// Maps each brick to the list of all the bricks below it
const bricksBelow = new Map(bricks.map((brick) => {
  const [[x1, y1, z1], [x2, y2]] = brick;
  return [brick, bricks.filter(
    ([[ox1, oy1, oz1], [ox2, oy2]]) => oz1 < z1 && ox1 <= x2 && ox2 >= x1 && oy1 <= y2 && oy2 >= y1
  )];
}));

// Basically, the bricks that lay directly on the ground. There may be other
// bricks already resting on other bricks, but we'll check them later
const floating = new Set(bricks.filter(([[, , z]]) => z > 1));
// We're going to let the bricks fall until all the bricks are resting
while (floating.size) {
  for (const brick of floating) {
    const below = bricksBelow.get(brick);
    // Check if all the bricks below the current one are already resting
    const allResting = below.every(brickBelow => !floating.has(brickBelow));
    if (allResting) {
      const maxZ = Math.max(0, ...below.map(([, [, , z]]) => z));
      // We're "falling down" the bricks. WARNING: this mutates the brick data!
      const zDiff = brick[0][2] - maxZ - 1;
      brick[0][2] -= zDiff;
      brick[1][2] -= zDiff;
      // Now the brick is resting on either the ground or other resting bricks
      floating.delete(brick);
    }
  }
}

// This maps every brick to the list of the brick it rests on. May be shorter
// than the list from `brickBelow` if they're not of the same height
const supportedBy = new Map();
for (const [brick, below] of bricksBelow) {
  const [[, , z]] = brick;
  supportedBy.set(brick, below.filter(([, [, , oz]]) => oz === z - 1));
}

// A brick is disintegrable if it's supported by more than one brick
const disintegrableBricks = bricks.filter(brick => {
  const bricksAbove = bricks.filter(otherBrick => supportedBy.get(otherBrick).includes(brick));
  return bricksAbove.every(otherBrick => supportedBy.get(otherBrick).length > 1);
});

console.log(disintegrableBricks.length);

const countFallingBricks = (removedBrick) => {
  const fallenBricks = new Set([removedBrick]);
  let fallenCount = 0;
  // We count the falling bricks until there are no more
  while (fallenBricks.size > fallenCount) {
    fallenCount = fallenBricks.size;
    for (const brick of bricks) {
      // If the brick is already fallen, or if lays on the ground, we skip it
      if (fallenBricks.has(brick) || supportedBy.get(brick).length === 0) continue;
      const isSupported = supportedBy.get(brick).some(brickBelow => !fallenBricks.has(brickBelow));
      // If all the supporting bricks have fallen, the brick start falling
      if (!isSupported) fallenBricks.add(brick);
    }
  }
  // Remove the brick itself
  return fallenCount - 1;
};

const fallingBricksCounts = bricks.map(countFallingBricks);
console.log(fallingBricksCounts.reduce((sum, count) => sum + count));
