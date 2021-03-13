const input = require("../input");
const file = input("input.txt");
const lines = file.split(/[\r\n]/g);

const getDigits = (str) => str.match(/[0-9]/g).join("");

let currentMask = "";
let sum = 0n;
const mem = {};

const applyMask = (number) => {
  let value = BigInt(number);
  currentMask
    .split("")
    .reverse()
    .forEach((m, i) => {
      switch (m) {
        case "1":
          value = BigInt(1n << BigInt(i)) | value;
          break;
        case "0":
          value = BigInt.asUintN(64, ~BigInt(1n << BigInt(i))) & value;
          break;
        default:
          break;
      }
    });
  return value;
};

for (const line of lines) {
  const tokens = line.split(" ");
  if (tokens[0].startsWith("mask")) {
    currentMask = tokens[2];
  } else {
    const val = applyMask(tokens[2]);
    const addr = getDigits(tokens[0]);
    mem[addr] = val;
  }
}

console.log(Object.values(mem).reduce((acc, c) => acc + c, 0n));

// Reset
currentMask = "";
const largerMemory = {};

const getAddresses = (addr) => {
  const transformAddr = (tAddr, maskIndex) => {
    if (maskIndex === currentMask.length) {
      return tAddr;
    }
    let ar = tAddr.split("");
    switch (currentMask[maskIndex]) {
      case "0":
        return transformAddr(tAddr, maskIndex + 1);
      case "1":
        ar.splice(maskIndex, 1, "1");
        return transformAddr(ar.join(""), maskIndex + 1);
      case "X":
        ar.splice(maskIndex, 1, "0");
        let l = transformAddr(ar.join(""), maskIndex + 1);
        ar = tAddr.split("");
        ar.splice(maskIndex, 1, "1");
        let k = transformAddr(ar.join(""), maskIndex + 1);
        return [l, k].flat();
    }
  };
  return transformAddr(addr, 0);
};

const appendZeros = (str) =>
  Array(36)
    .fill("0")
    .reduce(
      (acc, _, i) =>
        i < 36 - str.length
          ? [...acc, "0"]
          : [...acc, str[i - (36 - str.length)]],
      []
    )
    .join("");

lines
  .map((l) => l.split(" "))
  .forEach((tokens) => {
    if (tokens[0].startsWith("mask")) {
      currentMask = tokens[2];
    } else {
      const digits = getDigits(tokens[0]);
      const addresses = getAddresses(
        appendZeros(Number.parseInt(digits).toString(2))
      );
      const val = Number.parseInt(tokens[2]);
      addresses.forEach((addr) => (largerMemory[addr] = val));
    }
  });

console.log(
  Object.values(largerMemory).reduce((acc, c) => acc + BigInt(c), 0n)
);
