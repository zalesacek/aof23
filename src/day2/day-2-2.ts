import { getInput } from '../utils';

enum CubeType {
    red = 'red',
    green = 'green',
    blue = 'blue',
}

type SetModel = {
    blueCount: number,
    redCount: number,
    greenCount: number,
}

type GameModel = {
    id: number,
} & SetModel;

const getSetModel = (setString: string): SetModel => {
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

    return {
        blueCount,
        redCount,
        greenCount,
    };
}

const mapInputStringToGameModel = (gameString: string): GameModel => {
    const indexContent = gameString.split(':');

    const gameId = indexContent[0].split(' ')[1];
    let blueCount = 0;
    let redCount = 0;
    let greenCount = 0;

    const sets = indexContent[1].split(';');
    sets.map((s) => {
        const setModel = getSetModel(s);
        if (setModel.blueCount > blueCount) {
            blueCount = setModel.blueCount;
        }
        if (setModel.redCount > redCount) {
            redCount = setModel.redCount;
        }
        if (setModel.greenCount > greenCount) {
            greenCount = setModel.greenCount;
        }
    })

    return {
        id: parseInt(gameId),
        blueCount,
        redCount,
        greenCount,
    };
}

const getGamePower = (gameModel: GameModel): number => {
    const blue = gameModel.blueCount === 0 ? 1 : gameModel.blueCount;
    const red = gameModel.redCount === 0 ? 1 : gameModel.redCount;
    const green = gameModel.greenCount === 0 ? 1 : gameModel.greenCount;
    return blue * red * green;
}

async function main() {
    const inputList = getInput('input.txt');

    let powerSum = 0;
    inputList.map((inp) => {
        const gameModel = mapInputStringToGameModel(inp);
        const gamePower = getGamePower(gameModel);
        powerSum += gamePower;
    });

    console.log(powerSum);
}

void main();
