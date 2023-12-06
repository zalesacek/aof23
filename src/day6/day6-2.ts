import { getInput } from '../utils';

type Race = {
    time: number,
    distance: number,
}

const getNumbers = (string: string) => string.match(/\d+/g)!.map(Number);

const getRace = (input: string[]): Race => {
    const arrays = input.map(getNumbers);
    const time = parseInt(arrays[0].join(''));
    const distance = parseInt(arrays[1].join(''));
    return { time, distance };
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
    const race = getRace(inputList);

    const possibleWays = getWaysCount(race);

    console.log(`${possibleWays}`);
}

void main();
