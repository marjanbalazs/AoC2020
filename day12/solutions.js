const input = require('../input');

const file = input('input.txt');

const degreeToDir = {
  0: 'E',
  90: 'N',
  180: 'W',
  270: 'S',
};

const boat = {
  init() {
    this.position = [0, 0];
    this.dir = 0;
  },
  goEast(param) {
    this.position[0] += param;
  },
  goNorth(param) {
    this.position[1] += param;
  },
  goWest(param) {
    this.position[0] -= param;
  },
  goSouth(param) {
    this.position[1] -= param;
  },
  turn(dir, param) {
    const rotation = dir === 'L' ? param : 360 - param;
    this.dir = (this.dir + rotation) % 360;
  },
  forward(param) {
    const dirTo = degreeToDir[`${this.dir}`];
    switch (dirTo) {
      case 'E':
        this.goEast(param);
        break;
      case 'N':
        this.goNorth(param);
        break;
      case 'W':
        this.goWest(param);
        break;
      case 'S':
        this.goSouth(param);
        break;
      default:
        break;
    }
  },
  go(line) {
    const param = parseInt(line.slice(1, line.length), 10);
    switch (line.slice(0, 1)) {
      case 'E':
        this.goEast(param);
        break;
      case 'N':
        this.goNorth(param);
        break;
      case 'W':
        this.goWest(param);
        break;
      case 'S':
        this.goSouth(param);
        break;
      case 'L':
        this.turn('L', param);
        break;
      case 'R':
        this.turn('R', param);
        break;
      case 'F':
        this.forward(param);
        break;
      default:
        console.log('Problem in go');
        break;
    }
  },
  calcDistance() {
    return this.position.reduce((acc, c) => acc + Math.abs(c), 0);
  },
};

const content = file.split(/\r\n/g);

const boatInstance = Object.create(boat);
boatInstance.init();
content.forEach((line) => boatInstance.go(line));
console.log(boatInstance.calcDistance());

const boatWithWaypoint = {
  init(startingWaypoint) {
    this.waypoint = startingWaypoint;
    this.shipPosition = [0, 0];
  },
  setEast(param) {
    this.waypoint[0] += param;
  },
  setNorth(param) {
    this.waypoint[1] += param;
  },
  setWest(param) {
    this.waypoint[0] -= param;
  },
  setSouth(param) {
    this.waypoint[1] -= param;
  },
  turn(dir, param) {
    const rotation = dir === 'L' ? param : 360 - param;
    switch (rotation) {
      case 90:
        this.waypoint = [-this.waypoint[1], this.waypoint[0]];
        break;
      case 180:
        this.waypoint = [-this.waypoint[0], -this.waypoint[1]];
        break;
      case 270:
        this.waypoint = [this.waypoint[1], -this.waypoint[0]];
        break;
      default:
        console.log('problem at rotation');
        break;
    }
  },
  forward(param) {
    this.shipPosition = this.shipPosition.map((val, i) => this.waypoint[i] * param + val);
  },
  go(line) {
    const param = parseInt(line.slice(1, line.length), 10);
    switch (line.slice(0, 1)) {
      case 'E':
        this.setEast(param);
        break;
      case 'N':
        this.setNorth(param);
        break;
      case 'W':
        this.setWest(param);
        break;
      case 'S':
        this.setSouth(param);
        break;
      case 'L':
        this.turn('L', param);
        break;
      case 'R':
        this.turn('R', param);
        break;
      case 'F':
        this.forward(param);
        break;
      default:
        console.log('Problem in set');
        break;
    }
  },
  calcDistance() {
    return this.shipPosition.reduce((acc, c) => acc + Math.abs(c), 0);
  },
};

const waypointBoat = Object.create(boatWithWaypoint);

waypointBoat.init([10, 1]);
content.forEach((line) => waypointBoat.go(line));
console.log(waypointBoat.calcDistance());
