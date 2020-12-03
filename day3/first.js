const readline = require('readline');
const fs = require('fs');

const lines = [];

const stepper = (field) => {
  let currentWidth = 0;
  let currentDepth = 0;
  const maxWidth = field[0].length;
  const goalDepth = field.length;
  let treeCount = 0;

  const checkTree = (c) => c === '#';

  while (currentDepth !== goalDepth) {
    treeCount = checkTree(field[currentDepth][currentWidth])
      ? treeCount + 1
      : treeCount;
    currentDepth += 1;
    currentWidth = (currentWidth + 3) % maxWidth;
  }
  return treeCount;
};

const rl = readline.createInterface({
  input: fs.createReadStream('input.txt'),
});

rl.on('line', (line) => {
  lines.push(line);
});

rl.on('close', () => {
  const result = stepper(lines);
  console.log(result);
});
