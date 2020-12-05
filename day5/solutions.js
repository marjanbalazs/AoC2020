const input = require('../input');

const fileContent = input('input.txt');

const codeToNum = (code) => (code === 'B' || code === 'R' ? 1 : 0);
const toVal = (num, index) => num * (2 ** index);

const splitSeating = (line) => [line.slice(0, 7), line.slice(7, line.length)];
const seatCodesToNumbers = (coding) => [...coding].map((l) => codeToNum(l));
const numbersToSeatNumbers = (numbers) => numbers.reduce((acc, r, idx) => acc + toVal(r, idx), 0);

const idList = fileContent
  .split('\r\n')
  .map((line) => splitSeating(line))
  .map(([row, col]) => [
    seatCodesToNumbers(row),
    seatCodesToNumbers(col)])
  .map(([row, col]) => [
    numbersToSeatNumbers(row.reverse()),
    numbersToSeatNumbers(col.reverse()),
  ])
  .map(([row, col]) => row * 8 + col);

console.log(Math.max(...idList));

const secondAnswer = idList
  .sort((a, b) => a - b)
  .reduce(
    (ret, item, index, array) => (item + 2 === array[index + 1] ? item + 1 : ret),
    0,
  );

console.log(secondAnswer);
