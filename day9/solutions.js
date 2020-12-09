const input = require('../input');

const file = input('input.txt');

const content = file.split('\r\n').map((x) => parseInt(x, 10));

const findProductOfTwo = (array, left, target) => {
  for (let j = left; j < target; j += 1) {
    for (let i = left; i < target; i += 1) {
      if (j !== i && (array[i] + array[j]) === array[target]) {
        return true;
      }
    }
  }
  return false;
};

const searchTarget = () => {
  let [left, targetIndex] = [0, 25];
  while (findProductOfTwo(content, left, targetIndex)) {
    targetIndex += 1;
    left += 1;
  }
  return content[targetIndex];
};

const firstResult = searchTarget();

console.log(firstResult);

const searchMax = (left, right, array) => {
  let max = array[left];
  for (let i = left; i < right; i += 1) {
    if (array[i] > max) {
      max = array[i];
    }
  }
  return max;
};

const searchMin = (left, right, array) => {
  let min = array[left];
  for (let i = left; i < right; i += 1) {
    if (array[i] < min) {
      min = array[i];
    }
  }
  return min;
};

const sum = (left, right, array) => {
  let s = 0;
  for (let i = left; i < right; i += 1) {
    s += array[i];
  }
  return s;
};

const searchSumMembers = (array, target) => {
  let sumLen = 2;
  let left = 0;
  while (sum(left, left + sumLen, array) !== target) {
    left += 1;
    if (left + sumLen === array.length - 1) {
      left = 0;
      sumLen += 1;
    }
    if (sumLen === array.length) {
      return -1;
    }
  }
  return searchMin(left, left + sumLen, array) + searchMax(left, left + sumLen, array);
};

console.log(searchSumMembers(content, firstResult));
