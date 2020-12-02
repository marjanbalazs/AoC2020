const readline = require('readline');
const fs = require('fs');

const lines = [];

const Rule = {
  createRule(ruleString) {
    this.lowerPlace = 0;
    this.upperPlace = 0;
    this.letter = '';
    const [freq, string] = ruleString.split(' ');
    const [lower, upper] = freq.split('-');
    this.lowerPlace = parseInt(lower, 10) - 1;
    this.upperPlace = parseInt(upper, 10) - 1;
    this.letter = string;
  },
  checkRule(string) {
    if (
      string[this.lowerPlace] === this.letter
      && string[this.upperPlace] === this.letter
    ) {
      return false;
    }
    if (
      string[this.lowerPlace] !== this.letter
      && string[this.upperPlace] !== this.letter) {
      return false;
    }
    return true;
  },
};

const rl = readline.createInterface({
  input: fs.createReadStream('input.txt'),
});

rl.on('line', (line) => {
  const [rule, password] = line.split(': ');
  lines.push({ rule, password });
});

rl.on('close', () => {
  const rules = lines.map((val) => {
    const rule = Object.create(Rule);
    rule.createRule(val.rule);
    return rule;
  });

  const results = rules.map((rule, index) => rule.checkRule(lines[index].password));

  const result = results.reduce((acc, val) => {
    if (val) {
      return acc + 1;
    }
    return acc;
  }, 0);

  console.log(result);
});
