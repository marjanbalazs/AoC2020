const readline = require('readline');
const fs = require('fs');

const findProductOfTwo = (array, target) => {
  for (let j = 0; j < array.length; j++) {
    for (let i = 0; i < array.length; i++) {
      if (j !== i && (array[i] + array[j]) === target) {
        return array[i] * array[j];
      }
    }
  }
  return -1;
};

const findProductOfThree = (array, target) => {
  for (let j = 0; j < array.length; j++) {
    for (let i = 0; i < array.length; i++) {
      for (let k = 0; k < array.length; k++) {
        if (j !== i
                    && j !== k
                    && (array[i] + array[j] + array[k]) === target) {
          return array[i] * array[j] * array[k];
        }
      }
    }
  }
  return -1;
};

const lines = [];

const rl = readline.createInterface({
  input: fs.createReadStream('input.txt'),
});

rl.on('line', (line) => {
  lines.push(parseInt(line, 10));
});

rl.on('close', () => {
  console.log(findProductOfTwo(lines, 2020));
  console.log(findProductOfThree(lines, 2020));
});
