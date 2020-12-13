const timeProfile = require('time-profile');
const input = require('../input');

const profiler = timeProfile.getProfiler('aProfiler');

const file = input('input.txt');

let accumulator = 0;
const opMem = file.split('\r\n');
let opCntr = 0;

profiler.start('app');

function changeInstruction(op) {
  return op.includes('jmp') ? op.replace('jmp', 'nop') : op.replace('nop', 'jmp');
}

function go() {
  const visitedOps = new Set();
  while (!visitedOps.has(opCntr)) {
    const op = opMem[opCntr];
    const [opCode, param] = op.split(' ');
    visitedOps.add(opCntr);
    switch (opCode) {
      case 'jmp':
        opCntr += parseInt(param, 10);
        break;
      case 'acc':
        accumulator += parseInt(param, 10);
        opCntr += 1;
        break;
      case 'nop':
        opCntr += 1;
        break;
      default:
        return true;
    }
  }
  return false;
}
profiler.start('first solution');
go();
profiler.end('first solution');
console.log(accumulator);

function findOp() {
  let opCngCntr = 0;
  while (true) {
    accumulator = 0;
    opCntr = 0;
    if (!opMem[opCngCntr].includes('acc')) {
      accumulator = 0;
      opCntr = 0;
      opMem[opCngCntr] = changeInstruction(opMem[opCngCntr]);
      if (go()) {
        break;
      }
      opMem[opCngCntr] = changeInstruction(opMem[opCngCntr]);
    }
    opCngCntr += 1;
  }
}

profiler.start('second solution');
findOp();
profiler.end('second solution');

console.dir(accumulator);
profiler.end('app');
// in the end, you can dump the profile data to a json
// const json = profiler.toJSON(); // [ Entry { name, start, end, duration, pid }, ... ]

// also you can print the profile timeline
console.log(profiler.toString('this is timeline:'));

// you shoud destroy it when it's not needed anymore
profiler.destroy();
