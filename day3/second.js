const readline = require('readline');
const fs = require('fs');

const lines = [];

const createStepper = (stepRight, stepDown) => {
  const checkTree = (c) => c === '#';

  const stepper = (field) => {
    let treeCount = 0;
    let currentDepth = 0;
    let currentWidth = 0;
    const maxWidth = field[0].length;
    const goalDepth = field.length;
    while (currentDepth < goalDepth) {
      treeCount = checkTree(field[currentDepth][currentWidth])
        ? treeCount + 1
        : treeCount;
      currentDepth += stepDown;
      currentWidth = (currentWidth + stepRight) % maxWidth;
    }
    return treeCount;
  };
  return stepper;
};

const rl = readline.createInterface({
  input: fs.createReadStream('input.txt'),
});

rl.on('line', (line) => {
  lines.push(line);
});

rl.on('close', () => {
  const resArr = [];
  resArr.push(createStepper(1, 1));
  resArr.push(createStepper(3, 1));
  resArr.push(createStepper(5, 1));
  resArr.push(createStepper(7, 1));
  resArr.push(createStepper(1, 2));
  const resValArr = resArr.map((x) => x(lines));
  console.dir(resValArr);
  const result = resValArr.reduce((acc, x) => acc * x, 1);
  console.log(result);
});
