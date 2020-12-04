const readline = require('readline');
const fs = require('fs');

const lines = [];

const fieldsToValidate = [
  {
    name: 'byr',
    required: true,
    validator: (string) => {
      const val = parseInt(string, 10);
      return !!(val >= 1920 && val <= 2002);
    },
  },
  {
    name: 'iyr',
    required: true,
    validator: (string) => {
      const val = parseInt(string, 10);
      return !!(val >= 2010 && val <= 2020);
    },
  },
  {
    name: 'eyr',
    required: true,
    validator: (string) => {
      const val = parseInt(string, 10);
      return !!(val >= 2020 && val <= 2030);
    },
  },
  {
    name: 'hgt',
    required: true,
    validator: (string) => {
      if (string.indexOf('in') === 2) {
        const val = parseInt(string.slice(0, 2), 10);
        return !!(val >= 59 && val <= 76);
      }
      if (string.indexOf('cm') === 3) {
        const val = parseInt(string.slice(0, 3), 10);
        return !!(val >= 150 && val <= 193);
      }
      return false;
    },
  },
  {
    name: 'hcl',
    required: true,
    validator: (string) => string.match(/^#([0-9]|[a-f]){6}$/),
  },
  {
    name: 'ecl',
    required: true,
    validator: (string) => {
      if (
        string === 'amb'
        || string === 'blu'
        || string === 'brn'
        || string === 'gry'
        || string === 'grn'
        || string === 'hzl'
        || string === 'oth'
      ) {
        return true;
      }
      return false;
    },
  },
  {
    name: 'pid',
    required: true,
    validator: (string) => string.match(/^\d{9}$/),
  },
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
      buffer = buffer.concat(`${line} `);
    } else {
      let valid = true;
      // eslint-disable-next-line no-restricted-syntax
      for (const field of fieldsToValidate) {
        if (field.required) {
          if (buffer.indexOf(field.name) !== -1) {
            const keyStart = buffer.indexOf(field.name);
            const value = buffer.slice(
              keyStart + 4,
              buffer.indexOf(' ', keyStart + 4),
            );
            if (!field.validator(value)) {
              valid = false;
            }
          } else {
            valid = false;
          }
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
  console.dir(`Result: ${validPassports}`);
});
