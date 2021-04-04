const input = require("../input");
const file = input("input.txt");

const lines = file.split("\r\n");
console.log(lines);

const [rules, inputs] = lines.reduce(
  (acc, line) => {
    if (line === "" || acc[1].length > 0) {
      acc[1].push(line);
      return acc;
    }
    acc[0].push(line);
    return acc;
  },
  [[], []]
);

let rulePrototype = {
  init: function (line) {
    const [ruleNum, rest] = line.split(":");
    const rules = rest.split("|").map((x) => x.trim());
    this.ruleNum = ruleNum;
    this.rules = rules;
  },
  resolveRule: function (rulesObjects) {
    if (
      this.rules.length === 1 &&
      (this.rules[0] === '"a"' || this.rules[0] === '"b"')
    ) {
      this.resolvedRule = this.rules[0].replace(/\"/g, "");
      return this.resolvedRule;
    } else {
      this.resolvedRule = this.rules.map((ruleFragment) =>
        ruleFragment
          .split(" ")
          .map((num) =>
            rulesObjects[parseInt(num, 10)].resolveRule(rulesObjects)
          )
      );
      return this.resolvedRule;
    }
  },
};

const ruleObjects = rules
  .map((rule) => {
    const obj = Object.create(rulePrototype);
    obj.init(rule);
    return obj;
  })
  .sort((a, b) => a.ruleNum - b.ruleNum);

ruleObjects.forEach((obj) => obj.resolveRule(ruleObjects));

console.dir(ruleObjects, { depth: 5 });