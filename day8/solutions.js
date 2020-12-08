const input = require('../input');

const file = input('input.txt');

let accumulator = 0;
const opMem = file.split('\r\n');
let opCntr = 0;

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

go();
console.log(accumulator);

function findOp() {
  let opCngCntr = 0;
  accumulator = 0;
  opCntr = 0;
  while (true) {
    if (!opMem[opCngCntr].includes('acc')) {
      opMem[opCngCntr] = changeInstruction(opMem[opCngCntr]);
      if (go()) {
        break;
      }
      opMem[opCngCntr] = changeInstruction(opMem[opCngCntr]);
    }
    opCntr = 0;
    accumulator = 0;
    opCngCntr += 1;
  }
}

findOp();
console.dir(accumulator);
