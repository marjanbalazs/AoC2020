const readline = require('readline');
const fs = require('fs');

const lines = [];

const Rule = {
  createRule(ruleString) {
    this.timesLimitLower = 0;
    this.timesLimitUpper = 0;
    this.letter = '';
    const [freq, string] = ruleString.split(' ');
    // Upon thinking, it is pretty ugly to coerce it like this...
    [this.timesLimitLower, this.timesLimitUpper] = freq.split('-');
    this.letter = string;
  },
  checkRule(string) {
    const num = [...string].reduce((acc, l) => {
      if (l === this.letter) {
        return acc + 1;
      }
      return acc;
    }, 0);
    if (num >= this.timesLimitLower && num <= this.timesLimitUpper) {
      return true;
    }
    return false;
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
