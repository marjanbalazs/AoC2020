const input = require('../input');

const fileContents = input('input.txt');
const compose = (...fns) => (args) => fns.reduceRight((arg, fn) => fn(arg), args);

const transformToContainerParseable = (line) => line.replace(/bags contain/gi, ':').replace(/\.|bags|bag|no|other|\d| /g, '').split(/:|,/g);
const mapToContainer = (mapObject, array) => {
  const [bag, ...containingBags] = array;
  containingBags.forEach((b) => {
    if (Object.keys(mapObject).includes(b)) {
      mapObject[`${b}`].add(bag);
    } else {
      mapObject[`${b}`] = new Set();
      mapObject[`${b}`].add(bag);
    }
  });
  return mapObject;
};

const findAllContainers = (initialColor, mapping) => {
  const solutions = new Set();
  const expand = (color) => {
    if (Object.keys(mapping).includes(color)) {
      mapping[`${color}`].forEach((e) => {
        solutions.add(e);
        expand(e);
      });
    }
  };
  expand(initialColor, solutions);
  return solutions;
};

const map = fileContents.split('\r\n')
  .map((line) => transformToContainerParseable(line))
  .reduce((acc, curr) => mapToContainer(acc, curr), {});

const solutionOne = findAllContainers('shinygold', map);

console.log(solutionOne.size);

const transformToContainedParseable = (line) => line.replace(/bags contain/gi, ':').replace(/\.|bags|bag|no|other| /g, '').split(/:|,/g).map((x) => x.trim());

const mapToContained = (mapObject, array) => {
  const [bag, ...containingBags] = array;
  mapObject[`${bag}`] = [];
  containingBags.forEach((b) => {
    for (let i = 0; i < b.slice(0, 1); i++) {
      mapObject[`${bag}`].push(b.slice(1, b.length));
    }
  });
  return mapObject;
};

const findAllContained = (initialColor, mapping) => {
  const solutions = [];
  const expand = (color) => {
    if (Object.keys(mapping).includes(color)) {
      mapping[`${color}`].forEach((e) => {
        solutions.push(e);
        expand(e);
      });
    }
  };
  expand(initialColor, solutions);
  return solutions;
};

const mapTwo = fileContents.split('\r\n')
  .map((line) => transformToContainedParseable(line))
  .reduce((acc, curr) => mapToContained(acc, curr), {});

const solutionTwo = findAllContained('shinygold', mapTwo).filter((x) => x !== '');
console.log(solutionTwo.length);
