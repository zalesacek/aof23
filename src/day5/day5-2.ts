import { getInput } from '../utils';

type SeedRange = {
    start: number,
    end: number,
}

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

const isNumber = (value: string): boolean => !isNaN(parseInt(value));

const getSeedsRange = (text: string): SeedRange[] => {
    const numbers = text.split(': ')[1].split(' ').map(char => parseInt(char));
    const ranges: SeedRange[] = [];

    for (let i = 0; i < numbers.length; i+=2) {
        ranges.push({
            start: numbers[i],
            end: numbers[i+1],
        })
    }

    return ranges;
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

function getLowestLocation(seedsRange: SeedRange[], categories: Category[]): number {
    let lowestLocationNumber = Infinity;

    for (const range of seedsRange) {
        for (let j = range.start; j < range.start + range.end; j++) {
            const location = getLocationNumber(j, categories);
            console.log(`Seed ${j} - ${location}`);
            if (location < lowestLocationNumber) {
                lowestLocationNumber = location;
            }
        }
    }

    return lowestLocationNumber;
}

async function main() {
    const start = performance.now();

    const inputList = getInput('test.txt');

    const seedsRange = getSeedsRange(inputList[0]);
    const categories = getCategories(inputList);
    
    const lowestLocation = getLowestLocation(seedsRange, categories);

    const end = performance.now();
    const duration = Math.round((end - start) * 10) / 10;

    console.log(`Lowest location: ${lowestLocation}\nTook ${duration} milliseconds.`);
}

void main();
