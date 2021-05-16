const input = require("../input");
const file = input("input.txt");
const tiles = file.split('\n\n').filter(x => !!x);

const edgesEnum = {
    TOP: 'TOP',
    RIGHT: 'RIGHT',
    BOTTOM: 'BOTTOM',
    LEFT: 'LEFT',
};

//https://code.likeagirl.io/rotate-an-2d-matrix-90-degree-clockwise-without-create-another-array-49209ea8b6e6
function rotate(matrix) {
    const n = matrix.length;
    const x = Math.floor(n / 2);
    const y = n - 1;
    for (let i = 0; i < x; i++) {
        for (let j = i; j < y - i; j++) {
            let k = matrix[i][j];
            matrix[i][j] = matrix[y - j][i];
            matrix[y - j][i] = matrix[y - i][y - j];
            matrix[y - i][y - j] = matrix[j][y - i];
            matrix[j][y - i] = k;
        }
    }
    return matrix;
}

const adjustEdges = (tile) => {
    tile.TOP = [...tile.tileMap[0]];
    tile.RIGHT = tile.tileMap.map(x => x.slice(-1)).flat();
    tile.BOTTOM = [...tile.tileMap[tile.tileMap.length - 1]];
    tile.LEFT = tile.tileMap.map(x => x.slice(0, 1)).flat();
}

const rotateTile = (tile) => {
    rotate(tile.tileMap);
    adjustEdges(tile);
}

const flipTile = (tile) => {
    const flipped = tile.tileMap.reduceRight((flippedTile, line) => {
        flippedTile.push(line);
        return flippedTile;
    }, []);
    tile.tileMap = flipped;
    adjustEdges(tile);
}

const flipEdgesOnly = (tile) => {
    tile.TOP.reverse();
    tile.RIGHT.reverse();
    tile.BOTTOM.reverse();
    tile.LEFT.reverse();
}

const transformations = [() => {}, rotateTile, rotateTile, rotateTile, flipTile, rotateTile, rotateTile, rotateTile];

const testSides = (lhs, rhs) => {
    Object.values(edgesEnum).forEach(lhsSide => {
        const leftTileSide = lhs[lhsSide].join('');
        Object.values(edgesEnum).forEach(rhsSide => {
            if (leftTileSide === rhs[rhsSide].join('')) {
                lhs.matches.push({
                    tile: rhs.tileID,
                    sideOwn: lhsSide,

                });
                rhs.matches.push({
                    tile: lhs.tileID,
                    sideOwn: rhsSide,
                });
            }
        })
    });
}

const collectMatchingEdges = (lhs, rhs) => {
    testSides(lhs, rhs);
    flipEdgesOnly(lhs);
    testSides(lhs, rhs);
    flipEdgesOnly(lhs);
}

let tileObjs = tiles.map(tile => {
    const [tileLine, ...tileMap] = tile.split('\n');
    return {
        tileID: tileLine.replaceAll(/\D/g, ''),
        tileMap: tileMap.map(x => x.split('')),
        TOP: tileMap[0].split(''),
        RIGHT: tileMap.map(x => x.slice(-1)),
        BOTTOM: tileMap[tileMap.length - 1].split(''),
        LEFT: tileMap.map(x => x.slice(0, 1)),
        matches: [],
    };
});

tileObjs.forEach((tile, i) => {
    tileObjs.forEach((otherTile, j) => {
        if (j > i) {
            collectMatchingEdges(tile, otherTile);
        }
    });
});

const answerOne = tileObjs.reduce((acc, x) => {
    if (x.matches.length === 2) {
        return acc * Number(x.tileID)
    }
    return acc;
}, 1);

console.log(answerOne);

const _ = Array(12).fill(0);
const map = _.map(x => x = new Array(12).fill(0));

map.forEach((row, rowIndex) => {
    row.forEach((elem, columnIndex) => {
        if (columnIndex === 0 && rowIndex === 0) {
            const cornerCards = tileObjs.filter(x => x.matches.length === 2);
            const topLeft = cornerCards.find(x => x.matches.find(match => match.sideOwn === edgesEnum.BOTTOM) && x.matches.find(match => match.sideOwn === edgesEnum.RIGHT));
            elem = topLeft;
            map[0][0] = topLeft;
            tileObjs = tileObjs.filter(tile => tile.tileID !== topLeft.tileID);
        } else if (columnIndex === 0) {
            const topEdgeTile = map[rowIndex - 1][0];
            const matchIDs = topEdgeTile.matches.map(x => x.tile);
            const tile = tileObjs.find(tile => matchIDs.includes(tile.tileID));
            const matchFound = transformations.some(transform => {
                transform(tile);
                if (tile.TOP.join('') === topEdgeTile.BOTTOM.join('')) {
                    map[rowIndex][columnIndex] = tile;
                    tileObjs = tileObjs.filter(tileObj => tileObj.tileID !== tile.tileID);
                    return true;
                }
                return false;
            });
            if (!matchFound) {
                throw new Error('Could not find top edge match for tile', tile.tileID);
            }
        } else {
            const leftEdgeTile = map[rowIndex][columnIndex - 1];
            const matchIDs = leftEdgeTile.matches.map(x => x.tile);
            const matchTiles = tileObjs.filter(tile => matchIDs.includes(tile.tileID));
            const matchFound = matchTiles.some(tile => {
                return transformations.some(transform => {
                    transform(tile);
                    if (tile.LEFT.join('') === leftEdgeTile.RIGHT.join('')) {
                        map[rowIndex][columnIndex] = tile;
                        tileObjs = tileObjs.filter(tileObj => tileObj.tileID !== tile.tileID);
                        return true;
                    }
                    return false;
                });
            });
            if (!matchFound) {
                throw new Error('Could not find left edge match for tile', leftEdgeTile.tileID);
            }
        }

    });
});

map.forEach(row => {
    row.forEach(tile => {
        tile.tileMap.shift();
        tile.tileMap.pop();
        for (let c of tile.tileMap) {
            c.shift();
            c.pop();
        }
    })
});

const tileMapLength = map[0][0].tileMap.length;

const str = map.reduce((mapAcc, tileRow) => {
    const tileRowStrings = tileRow.reduce((acc, tile) => {
        const tileMapRowStrings = tile.tileMap.map(row => row.join(''));
        return acc.map((a, i) => a + tileMapRowStrings[i]);
    }, Array(tileMapLength).fill('')).map(line => line + '\n');
    return mapAcc + tileRowStrings.join('');
}, '');
const seaMonsterPattern = 
`
                  # 
#    ##    ##    ###
 #  #  #  #  #  #  
`;
console.log(str);
console.log(seaMonsterPattern);
// I could use this as a pattern and move along the whole string with a window, column by column, line by line