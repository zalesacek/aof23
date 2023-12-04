import { getInput } from '../utils';

const possibleBlue = 14;
const possibleRed = 12;
const possibleGreen = 13;

enum CubeType {
    red = 'red',
    green = 'green',
    blue = 'blue',
}

type GameModel = {
    id: number,
    isGamePossible: boolean,
};

const isGamePossible = (
    blueCount: number,
    redCount: number,
    greenCount: number,
): boolean => blueCount <= possibleBlue &&
    redCount <= possibleRed &&
    greenCount <= possibleGreen;

const getIsSetPossible = (setString: string): boolean => {
    const cubesString = setString.trim().split(', ');
    let blueCount = 0;
    let redCount = 0;
    let greenCount = 0;

    cubesString.map((cs) => {
        const cube = cs.split(' ');
        const cubeType = cube[1] as CubeType;
        const cubesCount = parseInt(cube[0]);
        if (cubeType === CubeType.red) {
            redCount += cubesCount;
        } else if (cubeType === CubeType.blue) {
            blueCount += cubesCount;
        } else if (cubeType === CubeType.green) {
            greenCount += cubesCount;
        }
    })

    return isGamePossible(blueCount, redCount, greenCount);
}

const mapInputStringToGameModel = (gameString: string): GameModel => {
    const indexContent = gameString.split(':');

    const gameId = indexContent[0].split(' ')[1];
    let isGamePossible = true;
    const sets = indexContent[1].split(';');
    sets.map((s) => {
        const isPossible = getIsSetPossible(s);
        if (!isPossible) {
            isGamePossible = false;
            return;
        }
    })

    return {
        id: parseInt(gameId),
        isGamePossible,
    };
}

async function main() {
    const inputList = getInput('input.txt');

    let gameIdSum = 0;
    inputList.map((inp) => {
        const gameModel = mapInputStringToGameModel(inp);
        if (gameModel.isGamePossible) {
            gameIdSum += gameModel.id;
        }
    });

    console.log(gameIdSum);
}

void main();
