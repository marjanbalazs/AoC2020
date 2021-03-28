const input = require("../input");
const file = input("input.txt");

const lines = file.split(/[\r\n]/g);

const STATE = {
  active: true,
  inactive: false,
};

const initStates = lines.map((line) =>
  [...line].map((char) => (char === "#" ? STATE.active : STATE.inactive))
);

const gameOfLife3D = {
  init: function (size) {
    this.points = Array(size)
      .fill()
      .map((e) =>
        Array(size)
          .fill()
          .map((e) =>
            Array(size)
              .fill(STATE.inactive)
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
        y.map((state, zIndex) =>
          this.getNextState(xIndex, yIndex, zIndex, state)
        )
      )
    );
    this.points = newPoints;
  },
  getNextState: function (x, y, z, state) {
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
      .reduce((acc, point) => (point === STATE.active ? acc + 1 : acc), 0);

    return state === STATE.active
      ? activeNeighbours === 2 || activeNeighbours === 3
        ? STATE.active
        : STATE.inactive
      : activeNeighbours === 3
      ? STATE.active
      : STATE.inactive;
  },
  getActivePoints: function () {
    return this.points.reduce(
      (accX, x) =>
        accX +
        x.reduce(
          (accY, y) =>
            accY +
            y.reduce((accZ, z) => (z === STATE.active ? accZ + 1 : accZ), 0),
          0
        ),
      0
    );
  },
};

// 3D Game of Life
gameOfLife3D.init(30);
gameOfLife3D.initGame(initStates);
Array(6)
  .fill(0)
  .forEach(() => gameOfLife3D.play());
console.log(gameOfLife3D.getActivePoints());

// 4D Game of Life
const gameOfLife4D = {
  init: function (size) {
    this.points = Array(size)
      .fill()
      .map((e) =>
        Array(size)
          .fill()
          .map((e) =>
            Array(size)
              .fill()
              .map((e) =>
                Array(size)
                  .fill(STATE.inactive)
                  .map((e) => e)
              )
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
          this.offset,
          state
        );
      })
    );
  },
  setPoint: function (x, y, z, w, state) {
    this.points[x][y][z][w] = state;
  },
  play: function () {
    console.log('Play!')
    const newPoints = this.points.map((x, xIndex) =>
      x.map((y, yIndex) =>
        y.map((z, zIndex) =>
          z.map((state, wIndex) =>
            this.getNextState(xIndex, yIndex, zIndex, wIndex, state)
          )
        )
      )
    );
    this.points = newPoints;
  },
  getNextState: function (x, y, z, w, state) {
    const getNeighbours = (x, y, z, w) => {
      const xCoordinates = [x - 1, x, x + 1];
      const yCoordinates = [y - 1, y, y + 1];
      const zCoordinates = [z - 1, z, z + 1];
      const wCoordinates = [w - 1, w, w + 1];
      const neighbours = xCoordinates
        .map((x) => yCoordinates.map((y) => zCoordinates.map((z) => wCoordinates.map((w) => [x, y, z, w]))))
        .flat(3);
      neighbours.splice(40, 1);
      return neighbours;
    };

    const activeNeighbours = getNeighbours(x, y, z, w)
      .map(([x, y, z, w]) => this.points[x]?.[y]?.[z]?.[w])
      .filter((p) => p)
      .reduce((acc, point) => (point === STATE.active ? acc + 1 : acc), 0);

    return state === STATE.active
      ? activeNeighbours === 2 || activeNeighbours === 3
        ? STATE.active
        : STATE.inactive
      : activeNeighbours === 3
      ? STATE.active
      : STATE.inactive;
  },
  getActivePoints: function () {
    return this.points.reduce(
      (accX, x) =>
        accX +
        x.reduce(
          (accY, y) =>
            accY +
            y.reduce(
              (accZ, z) =>
                accZ +
                z.reduce(
                  (accW, w) => (w === STATE.active ? accW + 1 : accW),
                  0
                ),
              0
            ),
          0
        ),
      0
    );
  },
};


gameOfLife4D.init(30);
gameOfLife4D.initGame(initStates);
Array(6)
  .fill(0)
  .forEach(() => gameOfLife4D.play());
console.log(gameOfLife4D.getActivePoints());
