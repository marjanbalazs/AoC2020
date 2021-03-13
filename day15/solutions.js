const input = require("../input");
const file = input("input.txt");

const lines = file.split(/[\r\n]/g);
const numbers = lines[0].split(',');

const turn = (memo, lastNumber, turns) => {
    if (memo[lastNumber]) {
        let turnAppearance = memo[lastNumber];
        memo[lastNumber] = turns;
        return turns - turnAppearance;
    } else {
        memo[lastNumber] = turns;
        return 0;
    }
}

const getAnswer = (numbers, turns) => {
    turnsCntr = numbers.length + 1;
    number = 0;
    const memory = Array(turns).fill(0);
    numbers.forEach((x, i) => memory[Number.parseInt(x)] = i + 1);
    while (turnsCntr < turns) {
        number = turn(memory, number, turnsCntr);
        turnsCntr += 1;
    }
    console.log(number);
}

getAnswer(numbers, 2020);
getAnswer(numbers, 30000000);