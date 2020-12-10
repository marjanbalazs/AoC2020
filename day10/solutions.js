const input = require('../input');

const file = input('input.txt');

const content = file.split('\r\n')
  .map((x) => parseInt(x, 10))
  .filter((x) => x)
  .sort((a, b) => a - b);

const solutionOne = content.reduce((acc, x) => {
  acc[`${x - acc.prev}`] += 1;
  acc.prev = x;
  return acc;
}, { 1: 0, 3: 0, prev: 0 });

console.log(solutionOne['1'] * (content['3'] + 1));

content.push(content[content.length - 1] + 3);
content.push(0);

const contentTwo = content.sort((a, b) => a - b);

function findAllSolutions(array) {
  const memo = {};
  const findSolution = (index) => {
    if (array.length - 1 === index) {
      return 1;
    }
    let searchIndex = index + 1;
    const next = [];
    while (array[searchIndex] - array[index] <= 3) {
      next.push(searchIndex);
      searchIndex += 1;
    }
    return next.reduce((acc, x) => {
      if (memo[x]) {
        return acc + memo[x];
      }
      memo[x] = findSolution(x);
      return acc + memo[x];
    }, 0);
  };
  return findSolution(0);
}

console.log(findAllSolutions(contentTwo));
