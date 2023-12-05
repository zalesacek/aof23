import { getInput } from '../utils';

const isNumber = (value: string): boolean => !isNaN(parseInt(value));

export type Mapper = {
    destinationStart: number,
    sourceStart: number,
    rangeLength: number,
}

export type Category = {
    id: string,
    maps: Mapper[],
}

export type Seed = {
    id: number,
    soil: number,
    fert: number,
    water: number,
    light: number,
    temp: number,
    humidity: number,
    location: number,
}

function getCategories(input: string[]): Category[] {
    const sections = [];

    let section = {} as Category;
    for (let i = 1; i < input.length; i++) {
        const line = input[i];
        if (isNumber(line[0])) {
            const numbers = line.split(' ');
            if (!section.maps) {
                section.maps = [];
            }
            section.maps.push({
                destinationStart: parseInt(numbers[0]),
                sourceStart: parseInt(numbers[1]),
                rangeLength: parseInt(numbers[2]),
            });
            if (i + 1 === input.length) {
                sections.push(section);
            }
        } else {
            if (section.id) {
                sections.push(section);
                section = {} as Category;
            }
            section.id = line;
        }
    }

    return sections;
}

function fullfillValue(number: number, section: Category): number {
    let res = number;
    for (const map of section.maps) {
        const startSeed = map.sourceStart;
        const endSeed = map.sourceStart + map.rangeLength - 1;

        if (number >= startSeed && number <= endSeed) {
            res = map.destinationStart + (number - map.sourceStart)
        }
    }
    return res;
}

function getSeedIds(input: string): number[] {
    return input.split(' ').map((char) => parseInt(char));
}

function getLocationNumber(id: number, sections: Category[]) {
    const seedModel = {} as Seed;
    seedModel.id = id;
    for (const section of sections) {
        if (section.id === 'seed-to-soil map:') {
            seedModel.soil = fullfillValue(seedModel.id, section)
        } else if (section.id === 'soil-to-fertilizer map:') {
            seedModel.fert = fullfillValue(seedModel.soil, section)
        } else if (section.id === 'fertilizer-to-water map:') {
            seedModel.water = fullfillValue(seedModel.fert, section)
        } else if (section.id === 'water-to-light map:') {
            seedModel.light = fullfillValue(seedModel.water, section)
        } else if (section.id === 'light-to-temperature map:') {
            seedModel.temp = fullfillValue(seedModel.light, section)
        } else if (section.id === 'temperature-to-humidity map:') {
            seedModel.humidity = fullfillValue(seedModel.temp, section)
        } else if (section.id === 'humidity-to-location map:') {
            const location = fullfillValue(seedModel.humidity, section);
            seedModel.location = location;
        }
    }
    return seedModel.location;
}

async function main() {
    const inputList = getInput('input.txt');

    const seedIds = getSeedIds(inputList[0].split(': ')[1]);
    const sections = getCategories(inputList);
    let lowestLocationNumber = Infinity;
    for (const seed of seedIds) {
        const location = getLocationNumber(seed, sections);
        if (location < lowestLocationNumber) {
            lowestLocationNumber = location;
        }
    }
    console.log(lowestLocationNumber);
}

void main();
