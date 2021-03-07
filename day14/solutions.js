const input = require("../input");
const file = input("input.txt");
const lines = file.split(/[\r\n]/g);

let currentMask = "";
let sum = 0n;
const mem = {};

const applyMask = (number) => {
  let value = BigInt(number);
  currentMask.split("").reverse().forEach((m, i) => {
    switch (m) {
      case "1":
        value = BigInt(1n << BigInt(i)) | value;
        break;
      case "0":
        value = BigInt.asUintN(64,~BigInt(1n << BigInt(i))) & value;
        break;
      default:
        break;
    }
  });
  return value;
};

for(const line of lines) {
  const tokens = line.split(" ");
  if (tokens[0].startsWith("mask")) {
    currentMask = tokens[2];
  } else {
    const val = applyMask(tokens[2]);
    const addr = tokens[0].match(/[0-9]/g).join('') 
    mem[addr] = val;
  }
}

console.log(Object.values(mem).reduce((acc, c) => acc + c, 0n));
