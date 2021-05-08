const input = require("../input");
const file = input("input.txt");

var inputAndRule = file.split('\n\n').map(a => a.split('\n'));
var messages = inputAndRule[1];
var rules = [];
inputAndRule[0].forEach(a => rules[a.split(': ')[0]] = a.split(': ')[1]);
rules = rules.map(a => a.replaceAll('"', ''));

function expandAll(str) {
  while (str.match(/\d/)) {
    let strCopy = str.slice()
    let expList = strCopy.replaceAll(/[\(\)|a-z]/g, '').split(' ').filter(x => !!x);
    expList = new Set(expList);
    expList.forEach((exp) => {
      console.log(str);
      str = str.replaceAll(new RegExp(`((?<![0-9]))${exp}(?![0-9])`, 'g'), (rules[exp].includes('|') ? (`(${rules[exp]})`) : rules[exp]));
    });
  }
  return str.replaceAll(' ', '');
}

const rule = expandAll(rules[0]);
const loopRule = new RegExp(`^${rule}$`);
console.log(messages.filter(a => loopRule.test(a)).length);

//https://github.com/eQueline/Advent-of-Code-2020/blob/main/AoC%2019.js