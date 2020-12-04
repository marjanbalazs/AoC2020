const readline = require('readline');
const fs = require('fs');

const lines = [];

const fieldsToValidate = [
  { name: 'byr', required: true },
  { name: 'iyr', required: true },
  { name: 'eyr', required: true },
  { name: 'hgt', required: true },
  { name: 'hcl', required: true },
  { name: 'ecl', required: true },
  { name: 'pid', required: true },
  { name: 'cid', required: false },
];

const validator = (registry) => {
  let validPassports = 0;
  let buffer = '';
  if (registry[registry.length - 1] !== '') {
    registry.push('');
  }
  // eslint-disable-next-line no-restricted-syntax
  for (const line of registry) {
    if (line.length !== 0) {
      buffer = buffer.concat(line);
    } else {
      let valid = true;
      // eslint-disable-next-line no-restricted-syntax
      for (const field of fieldsToValidate) {
        if (field.required && buffer.indexOf(field.name) === -1) {
          valid = false;
        }
      }
      validPassports = valid ? validPassports + 1 : validPassports;
      buffer = '';
    }
  }
  return validPassports;
};

const rl = readline.createInterface({
  input: fs.createReadStream('input.txt'),
});

rl.on('line', (line) => {
  lines.push(line);
});

rl.on('close', () => {
  const validPassports = validator(lines);
  console.dir(validPassports);
});
