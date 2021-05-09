const input = require("../input");
const file = input("input.txt");

const tiles = file.split('\n\n').filter(x => !!x);

const orientationEnum = {
    UP: 'UP',
    DOWN: 'DOWN',
};

const sides = {
    TOP: 'TOP',
    RIGHT: 'RIGHT',
    BOTTOM: 'BOTTOM',
    LEFT: 'LEFT',
};

const matchOirentation = {
    SAME: 'SAME',
    OPP: 'OPP',
};

const flipTile = (tile) => {
    tile.TOP.reverse();
    tile.RIGHT.reverse();
    tile.BOTTOM.reverse();
    tile.LEFT.reverse();
    tile.orientation = tile.orientation === orientationEnum.UP ? orientationEnum.DOWN : orientationEnum.UP;
}

const collectMachingSides = (lhs, rhs) => {
    Object.values(sides).forEach(lhsSide => {
        const leftTileSide = lhs[lhsSide].join('');
        Object.values(sides).forEach(rhsSide => {
            if (leftTileSide === rhs[rhsSide].join('')) {
                lhs.matches.push({
                    tile: rhs.tileID,
                    sideOwn: lhsSide,
                    sideOther: rhsSide,
                    matchOirentation: matchOirentation.SAME,
                });
                rhs.matches.push({
                    tile: lhs.tileID,
                    sideOwn: rhsSide,
                    sideOther: lhsSide,
                    matchOirentation: matchOirentation.SAME,
                });
            }
        })
    });
    flipTile(lhs);
    Object.values(sides).forEach(lhsSide => {
        const leftTileSide = lhs[lhsSide].join('');
        Object.values(sides).forEach(rhsSide => {
            if (leftTileSide === rhs[rhsSide].join('')) {
                lhs.matches.push({
                    tile: rhs.tileID,
                    sideOwn: lhsSide,
                    sideOther: rhsSide,
                    matchOirentation: matchOirentation.OPP,
                });
                rhs.matches.push({
                    tile: lhs.tileID,
                    sideOwn: rhsSide,
                    sideOther: lhsSide,
                    matchOirentation: matchOirentation.OPP,
                });
            }
        })
    });
    flipTile(lhs);
}

const tileObjs = tiles.map(tile => {
    const [tileLine, ...tileMap] = tile.split('\n');
    return {
        tileID: tileLine.replaceAll(/\D/g, ''),
        tileWidth: tileMap[0].length,
        tileHeight: tileMap.length,
        TOP: tileMap[0].split(''),
        RIGHT: tileMap.map(x => x.slice(-1)),
        BOTTOM: tileMap[tileMap.length - 1].split(''),
        LEFT: tileMap.map(x => x.slice(0, 1)),
        orientation: orientationEnum.UP,
        matches: [],
    };
});

const tested = new Set();
tileObjs.forEach((tile) => {
    tileObjs.forEach((otherTile) => {
        if (tile.tileID !== otherTile.tileID  && ( !tested.has(tile.tileID) || !tested.has(otherTile.tileID))) {
            collectMachingSides(tile, otherTile);
        }
        tested.add(tile.tileID);
    });
});

tileObjs.sort((a,b) => a.matches.length - b.matches.length);

const anwserOne = tileObjs.reduce((acc, x) => {
    if (x.matches.length === 2) {
        return acc * Number(x.tileID)
    }
    return acc;
}, 1);

console.log(anwserOne);
console.dir(tileObjs, { depth: 10});
console.log(tileObjs.length);
