const input = require("../input");
const file = input("input.txt");

const lines = file.split(/[\r\n]/g).map((s) => s.replaceAll(" ", ""));
const compose = (...fns) => (args) =>
  fns.reduceRight((arg, fn) => fn(arg), args);

const TOKEN_TYPE = {
  PLUS: "PLUS",
  STAR: "STAR",
  LEFT_PAREN: "LEFT_PAREN",
  RIGHT_PAREN: "RIGHT_PAREN",
  NUMBER: "NUMBER",
};

const tokenize = (line) => {
  return line
    .split("")
    .map((char, index, line) => {
      switch (char) {
        case "+":
          return {
            type: TOKEN_TYPE.PLUS,
          };
        case "*":
          return {
            type: TOKEN_TYPE.STAR,
          };
        case "(":
          return {
            type: TOKEN_TYPE.LEFT_PAREN,
          };
        case ")":
          return {
            type: TOKEN_TYPE.RIGHT_PAREN,
          };
        case " ":
          return {};
        default:
          return {
            type: TOKEN_TYPE.NUMBER,
            value: Number.parseInt(char, 10),
          };
      }
    })
    .filter((token) => token.type);
};

const parse = (tokens) => {
  let currentToken = 0;
  const tokensLength = tokens.length;

  const parseExpression = () => {
    return parseBinary();
  };

  const parseBinary = () => {
    let left = parsePrimary();
    while (
      currentToken < tokensLength &&
      (tokens[currentToken].type === TOKEN_TYPE.PLUS ||
        tokens[currentToken].type === TOKEN_TYPE.STAR)
    ) {
      const operator = tokens[currentToken].type;
      currentToken += 1;
      const right = parsePrimary();
      left = {
        operator,
        left,
        right,
      };
    }
    return left;
  };

  const parsePrimary = () => {
    if (currentToken < tokensLength) {
      let ret;
      switch (tokens[currentToken].type) {
        case TOKEN_TYPE.NUMBER:
          ret = tokens[currentToken].value;
          break;
        case TOKEN_TYPE.LEFT_PAREN:
          currentToken += 1;
          let expr = parseExpression();
          if (tokens[currentToken].type === TOKEN_TYPE.RIGHT_PAREN) {
            ret = expr;
          } else {
            throw Error("DID NOT MATCH RIGHT PAREN");
          }
          break;
        default:
          break;
      }
      currentToken += 1;
      return ret;
    }
  };

  return (expr = (() => {
    try {
      return parseExpression();
    } catch (e) {
      console.log(e);
    }
  })());
};

const evaluate = (tree) => {
  if (typeof tree !== "object") {
    return tree;
  } else {
    if (tree.operator === TOKEN_TYPE.STAR) {
      return evaluate(tree.left) * evaluate(tree.right);
    }
    if (tree.operator === TOKEN_TYPE.PLUS) {
      return evaluate(tree.left) + evaluate(tree.right);
    }
  }
};

const evaluatedlines = lines.map((line) =>
  compose(evaluate, parse, tokenize)(line)
);

console.log(evaluatedlines.reduce((acc, x) => acc + x, 0));

const parseReversePrecedent = (tokens) => {
  let currentToken = 0;
  const tokensLength = tokens.length;

  const parseExpression = () => {
    return parseFactor();
  };

  const parseFactor = () => {
    let left = parsePlus();
    while (
      currentToken < tokensLength &&
      tokens[currentToken].type === TOKEN_TYPE.STAR
    ) {
      currentToken += 1;
      const right = parsePlus();
      left = {
        operator: TOKEN_TYPE.STAR,
        left,
        right,
      };
    }
    return left;
  };

  const parsePlus = () => {
    let left = parsePrimary();
    while (
      currentToken < tokensLength &&
      tokens[currentToken].type === TOKEN_TYPE.PLUS
    ) {
      currentToken += 1;
      const right = parsePrimary();
      left = {
        operator: TOKEN_TYPE.PLUS,
        left,
        right,
      };
    }
    return left;
  };

  const parsePrimary = () => {
    if (currentToken < tokensLength) {
      let ret;
      switch (tokens[currentToken].type) {
        case TOKEN_TYPE.NUMBER:
          ret = tokens[currentToken].value;
          break;
        case TOKEN_TYPE.LEFT_PAREN:
          currentToken += 1;
          let expr = parseExpression();
          if (tokens[currentToken].type === TOKEN_TYPE.RIGHT_PAREN) {
            ret = expr;
          } else {
            throw Error("DID NOT MATCH RIGHT PAREN");
          }
          break;
        default:
          break;
      }
      currentToken += 1;
      return ret;
    }
  };

  return (expr = (() => {
    try {
      return parseExpression();
    } catch (e) {
      console.log(e);
    }
  })());
};

const evaluatedReversePrecedenceLines = lines.map((line) =>
  compose(evaluate, parseReversePrecedent, tokenize)(line)
);


console.log(evaluatedReversePrecedenceLines.reduce((acc, x) => acc + x, 0));