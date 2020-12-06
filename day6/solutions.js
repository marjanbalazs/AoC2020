const input = require('../input');

const fileContent = input('input.txt');
const compose = (...fns) => (args) => fns.reduceRight((arg, fn) => fn(arg), args);

const splitString = (string) => string.split(/\r?\n/).filter((x) => x !== '');
const sumString = (strings) => new Set(strings.join('')).size;
const findDuplicates = (leftArray, rightArray) => [...leftArray].filter((x) => rightArray.includes(x));
const findCommonAnswers = (answers) => answers.reduce((acc, curr) => findDuplicates(acc, curr), answers[0]);

const answer1 = fileContent
  .split('\r\n\r\n')
  .map((x) => compose(sumString, splitString)(x))
  .reduce((acc, x) => acc + x, 0);

console.log(answer1);

const answer2 = fileContent
  .split('\r\n\r\n')
  .map((x) => compose(findCommonAnswers, splitString)(x))
  .reduce((acc, x) => acc + x.length, 0);

console.log(answer2);
