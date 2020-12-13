const input = require('../input');

const file = input('input.txt');

const content = file.split(/\r\n/g).map((line) => line.split(''));

const getNeighbours = (pos, array) => {
  const generateNeighbours = (p) => {
    const arr = [];
    for (let x = -1; x < 2; x += 1) {
      for (let y = -1; y < 2; y += 1) {
        if (x === 0 && y === 0) {
          // eslint-disable-next-line no-continue
          continue;
        }
        const elem = array[p[0] + x] ? array[p[0] + x][p[1] + y] : null;
        if (elem) {
          arr.push(elem);
        }
      }
    }
    return arr;
  };

  return generateNeighbours(pos);
};
const getsOccupied = (limit) => (n) => n.filter((x) => x === '#').length === limit;
const getsEmpty = (limit) => (n) => n.filter((x) => x === '#').length > limit;

function solver(neighbours, ruleEmpty, ruleOccupied) {
  const curr = content.map((x) => [...x]);
  let prev = [];
  let changed = true;
  while (changed) {
    prev = curr.map((x) => [...x]);
    changed = false;
    // eslint-disable-next-line no-loop-func
    prev.forEach((_, x) => _.forEach((val, y) => {
      const n = neighbours([x, y], prev);
      if (val === '#') {
        curr[x][y] = ruleEmpty(n) ? 'L' : '#';
      } else if (val === 'L') {
        curr[x][y] = ruleOccupied(n) ? '#' : 'L';
      }
      if (val !== curr[x][y]) {
        changed = true;
      }
    }));
  }
  return curr.reduce((a, x) => a + x.reduce((b, y) => b + (y === '#' ? 1 : 0), 0), 0);
}

console.log(solver(getNeighbours, getsEmpty(3), getsOccupied(0)));

const getVisibleNeighbours = (pos, array) => {
  const directions = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, +1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];
  const visible = [];
  let dir = 0;
  while (dir < directions.length) {
    let multiplier = 1;
    while (true) {
      const row = array[pos[0] + multiplier * directions[dir][0]];
      const elem = row ? row[pos[1] + multiplier * directions[dir][1]] : null;
      if (!elem) {
        dir += 1;
        break;
      } else if (elem !== '.') {
        visible.push(elem);
        dir += 1;
        break;
      } else {
        multiplier += 1;
      }
    }
  }
  return visible;
};

console.log(solver(getVisibleNeighbours, getsEmpty(4), getsOccupied(0)));
