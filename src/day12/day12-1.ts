import { getInput } from '../utils';

type Line = {
    id: number,
    unknownCount: number,
    damageCount: number,
    workingCount: number,
    totalDamage: number,
    length: number,
    items: string[],
    groups: number[],
}

const getLines = (input: string[]): Line[] => {
    const lines: Line[] = [];

    for (let i = 0; i < input.length; i++) {
        const current = input[i].split(' ');
        const items = current[0].split('');
        const groups = current[1].split(',').map((char) => parseInt(char));
        let unknownCount = 0;
        let damageCount = 0;
        let workingCount = 0;
        const totalDamage = groups.reduce((a, c) => a + c);

        for (const char of items) {
            if (char === '?') {
                unknownCount++;
            } else if (char === '.') {
                workingCount++;
            } else if (char === '#') {
                damageCount++;
            }
        }

        lines.push({
            id: i,
            unknownCount,
            damageCount,
            workingCount,
            totalDamage,
            length: items.length,
            items,
            groups,
        })
    }

    return lines;
}

const getPermutation = (prefix: string[], remainingDamage: number, remainingItems: number): string[][] => {
    if (remainingItems === 0) return remainingDamage === 0 ? [prefix] : [];

    const withDamage = getPermutation([...prefix, '#'], remainingDamage - 1, remainingItems - 1);
    const withoutDamage = getPermutation([...prefix, '.'], remainingDamage, remainingItems - 1);

    return [...withDamage, ...withoutDamage];
}

const getPermutations = (line: Line): string[][] => {
    const permutations = getPermutation([], line.totalDamage - line.damageCount, line.unknownCount);
    return permutations.map((p) => {
        const itemsCopy = [...line.items];
        for (let i = 0; i < itemsCopy.length; i++) {
            if (itemsCopy[i] === '?') {
                itemsCopy[i] = p.shift() || '.';
            }
        }
        return itemsCopy;
    });
}

const getGroupsFromPermutations = (permutations: string[][]) => {
    const groups: number[][] = [];
    for (const p of permutations) {
        let counter = 0;
        let temp: number[] = [];
        for (let i = 0; i < p.length; i++) {
            if (p[i] === '#') {
                counter++;
            } else {
                if (counter > 0) {
                    temp.push(counter);
                }
                counter = 0;
            }
        }
        temp.push(counter);
        const filtered = temp.filter((n) => n !== 0);
        groups.push(filtered);
    }

    return groups;
}

const getArrangment = (line: Line): number => {
    const permutations = getPermutations(line);
    const groups: number[][] = getGroupsFromPermutations(permutations);

    let options = 0;
    for (const group of groups) {
        let valid = true;
        for (let i = 0; i < group.length; i++) {
            if (line.groups[i] !== group[i]) {
                valid = false;
            }
        }
        if (valid) {
            options++;
        }
    }

    return options;
}

async function main() {
    const start = performance.now();
    const inputList = getInput('test.txt');
    const lines = getLines(inputList);

    let sum = 0;
    for (const line of lines) {
        sum += getArrangment(line);
    }

    const end = performance.now();
    const duration = Math.round((end - start) * 10) / 10;
    console.log(`Sum: ${sum} \nDuration: ${duration}ms`);
}

void main();