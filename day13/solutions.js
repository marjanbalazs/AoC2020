const input = require("../input");

const file = input("input.txt");

const [estimate, schedule] = file.split(/[\r\n]/g);
const est = Number.parseInt(estimate);
const timings = schedule
  .split(",")
  .filter((x) => x !== "x")
  .map((x) => Number.parseInt(x));

const delays = timings.map((x) => x - (est % x));
const min = Math.min(...delays);

console.log(min * timings[delays.indexOf(min)]);

// Chinese remainder theorem

const target = (base, remainder) => {
  const res = (base - remainder) % base;
  return res >= 0 ? res : res + base;
}

const timingsSecond = schedule
  .split(",")
  .map((x) => Number.parseInt(x))
  .reduce((acc, x, index) => (x ? [...acc, [x, target(x,index)]] : [...acc]), [])
  .sort((a, b) => b[0] - a[0]);

const res = timingsSecond.reduce(
  (acc, [modulo, remainder], index) => {
    if (index === 0) {
      return {
        modulo,
        remainder,
      };
    }
    let i = 0;
    let walker = acc.modulo * i;
    while ((acc.remainder + walker) % modulo !== remainder) {
      i += 1;
      walker = acc.modulo * i;
    }
    return {
      modulo: acc.modulo * modulo,
      remainder: acc.remainder + walker,
    }
  }, {}
);

console.log(res.remainder);