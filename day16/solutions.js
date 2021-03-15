const input = require("../input");
const file = input("input.txt");

const lines = file.split(/[\r\n]/g);

const fields = [];
let myTicket = "";
const nearbyTickets = [];

const parseFile = (lines) => {
  const firstEmptyLine = lines.indexOf("");
  const secondEmptyLine = lines.indexOf("", firstEmptyLine + 1);
  myTicket = lines[secondEmptyLine - 1].slice().split(",");
  lines.forEach((x, i) => {
    if (i < firstEmptyLine) {
      fields.push(x);
    }
    if (i > secondEmptyLine + 1) {
      nearbyTickets.push(x.split(",").map((num) => Number.parseInt(num)));
    }
  });
};

const buildFieldRanges = (fieldLines, fieldRanges) => {
  const splitAtColon = fieldLines.map((l) => l.split(":"));
  const fieldNames = splitAtColon.map((tokens) => tokens[0].replace(" ", ""));
  const fieldValues = splitAtColon
    .map((tokens) => tokens[1].trim().split(" or "))
    .map((fieldRanges) =>
      fieldRanges.map((range) =>
        range.split("-").map((n) => Number.parseInt(n))
      )
    );
  fieldNames.forEach((x, i) => (fieldRanges[x] = fieldValues[i]));
};

const validateTickets = (fieldRanges, nearbyTickets) => {
  const isFieldValid = (field) => {
    const ranges = Object.values(fieldRanges); // an array of arrays
    return ranges.reduce(
      (validity, fieldRanges) =>
        validity ||
        fieldRanges.reduce(
          (valid, range) =>
            valid || (range[0] <= field && field <= range[1]) ? true : false,
          false
        )
          ? true
          : false,
      false
    );
  };
  return nearbyTickets.map((ticket) =>
    ticket.map((field) => isFieldValid(field))
  );
};

const calculateErrorRate = (validatedTickets) =>
  validatedTickets.reduce(
    (accOuter, ticket, ticketIndex) =>
      accOuter +
      ticket.reduce((accInner, field, fieldIndex) => {
        if (!field) {
          return accInner + nearbyTickets[ticketIndex][fieldIndex];
        } else {
          return accInner;
        }
      }, 0),
    0
  );

const getValidNearbyTickets = (validatedTickets, nearbyTickets) => {
  const getValidTicketArray = (validatedTickets) =>
    validatedTickets.map((ticket) =>
      ticket.reduce(
        (acc, fieldValidity) => (acc && fieldValidity ? true : false),
        true
      )
    );
  const validTicketArray = getValidTicketArray(validatedTickets);
  return nearbyTickets.filter((_, i) => validTicketArray[i]);
};

parseFile(lines);
const fieldRanges = {};
buildFieldRanges(fields, fieldRanges);
const validatedTickets = validateTickets(fieldRanges, nearbyTickets);
const errorRate = calculateErrorRate(validatedTickets);

console.log(errorRate);

const validNearbyTickets = getValidNearbyTickets(
  validatedTickets,
  nearbyTickets
);

function mapTicketFieldToColumn(fieldRanges, validNearbyTickets) {
  function isRangeValidForColumn(ranges, columnIndex) {
    return validNearbyTickets.reduce(
      (columnValid, ticket) =>
        columnValid &&
        ranges.reduce(
          (valid, range) =>
            valid ||
            (range[0] <= ticket[columnIndex] && ticket[columnIndex] <= range[1])
              ? true
              : false,
          false
        )
          ? true
          : false,
      true
    );
  }

  const mapping = Object.entries(fieldRanges).map(
    ([fieldName, ranges], index) => {
      return {
        fieldName,
        valid: Array(validNearbyTickets[0].length)
          .fill(0)
          .map((_, i) => isRangeValidForColumn(ranges, i)),
      };
    }
  );
  return mapping;
}

const fieldToColumnMap = mapTicketFieldToColumn(
  fieldRanges,
  validNearbyTickets
);

const sortedValidityMap = fieldToColumnMap.sort(
  (a, b) =>
    a.valid.reduce((acc, x) => (x ? acc + 1 : acc), 0) -
    b.valid.reduce((acc, x) => (x ? acc + 1 : acc), 0)
);

const validityMask = Array(validNearbyTickets[0].length).fill(true);

const fieldAndColumn = sortedValidityMap.map(({ fieldName, valid }) => {
  const masked = valid.map((v, i) => v && validityMask[i]);
  const validColumn = masked.indexOf(true);
  validityMask[validColumn] = false;
  return {
    fieldName,
    validColumn,
  };
});

const solution = fieldAndColumn.reduce(
  (acc, { fieldName, validColumn }) =>
    fieldName.startsWith("departure") ? myTicket[validColumn] * acc : acc,
  1
);
console.log(solution);
