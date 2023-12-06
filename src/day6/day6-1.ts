import { getInput } from '../utils';

type Race = {
    time: number,
    distance: number,
}

const getNumbers = (string: string) => string.match(/\d+/g)!.map(Number);

const getRace = (input: string[]): Race[] => {
    const arrays = input.map(getNumbers);
    return arrays[0].map((time, index) => ({
        time,
        distance: arrays[1][index]
    }));
}

const getWaysCount = (race: Race): number => {
    let waysCount = 0;
    for (let i = 0; i < race.time; i++) {
        let speed = i;
        let travelTime = race.time - i;
        let distance = speed * travelTime;
        if (distance > race.distance) {
            waysCount++;
        }
    }
    return waysCount;
}

async function main() {
    const inputList = getInput('input.txt');
    const races = getRace(inputList);

    const possibleWays: number[] = [];
    for (const race of races) {
        possibleWays.push(getWaysCount(race));
    }

    const p1result = possibleWays.reduce((a, c) => c * a, 1);

    console.log(`${p1result}`);
}

void main();
