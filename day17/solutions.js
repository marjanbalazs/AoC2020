const input = require("../input");
const file = input("input.txt");

const lines = file.split(/[\r\n]/g);

const state = {
  active: true,
  inactive: false,
};

const initStates = lines.map((line) =>
  [...line].map((char) => (char === "#" ? state.active : state.inactive))
);

const coordinateSystem = {
  init: function (size) {
    this.points = Array(size)
      .fill()
      .map((e) =>
        Array(size)
          .fill()
          .map((e) =>
            Array(size)
              .fill(state.inactive)
              .map((e) => e)
          )
      );
    this.offset = size / 2;
  },
  initGame: function (initPoints) {
    initPoints.forEach((line, xIndex) =>
      line.forEach((state, yIndex) => {
        this.setPoint(
          xIndex + this.offset,
          yIndex + this.offset,
          this.offset,
          state
        );
      })
    );
  },
  setPoint: function (x, y, z, state) {
    this.points[x][y][z] = state;
  },
  play: function () {
    const newPoints = this.points.map((x, xIndex) =>
      x.map((y, yIndex) =>
        y.map((z, zIndex) => this.getNextState(xIndex, yIndex, zIndex))
      )
    );
    this.points = newPoints;
  },
  getNextState: function (x, y, z) {
    const getNeighbours = (x, y, z) => {
      const xCoordinates = [x - 1, x, x + 1];
      const yCoordinates = [y - 1, y, y + 1];
      const zCoordinates = [z - 1, z, z + 1];
      const neighbours = xCoordinates
        .map((x) => yCoordinates.map((y) => zCoordinates.map((z) => [x, y, z])))
        .flat(2);
      neighbours.splice(13, 1);
      return neighbours;
    };

    const activeNeighbours = getNeighbours(x, y, z)
      .map(([x, y, z]) => this.points[x]?.[y]?.[z])
      .filter((p) => p)
      .reduce((acc, point) => (point === state.active ? acc + 1 : acc), 0);

    const coordinate = coordinateSystem.points[x][y][z];

    return coordinate === state.active
      ? activeNeighbours === 2 || activeNeighbours === 3
        ? state.active
        : state.inactive
      : activeNeighbours === 3
      ? state.active
      : state.inactive;
  },
  getActivePoints: function () {
    return this.points.reduce(
      (accX, x) =>
        accX +
        x.reduce(
          (accY, y) =>
            accY +
            y.reduce((accZ, z) => (z === state.active ? accZ + 1 : accZ), 0),
          0
        ),
      0
    );
  },
};

// Game of Life
coordinateSystem.init(100);
coordinateSystem.initGame(initStates);

Array(6)
  .fill(0)
  .forEach(() => coordinateSystem.play());
console.log(coordinateSystem.getActivePoints());
