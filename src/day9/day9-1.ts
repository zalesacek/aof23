import { getInput } from '../utils';

const getHistoryLine = (value: string[]) => value.map((str) => str.split(' ').map(Number));

const getLastNumber = (line: number[]): number => {
    const sequences: number[][] = [ line ];
    let allZeros = false;

    while (!allZeros) {
        const curr = sequences[sequences.length - 1];
        let temp: number[] = [];
        let allValuesAreZero = true;

        for (let i = 0; i < curr.length - 1; i++) {
            const diff = curr[i + 1] - curr[i];
            temp.push(diff);
            if (diff !== 0) {
                allValuesAreZero = false;
            }
        }

        sequences.push(temp);
        allZeros = allValuesAreZero;
    }

    for (let i = 0; i < sequences.length - 1; i++) {
        const idx = sequences.length - 1 - i;
        const last1 = sequences[idx][sequences[idx].length - 1];
        const last2 = sequences[idx - 1][sequences[idx - 1].length - 1];
        sequences[idx - 1].push(last1 + last2);
    }

    return sequences[0][sequences[0].length - 1];
}

async function main() {
    const start = performance.now();
    const inputList = getInput('input.txt');
    const lines = getHistoryLine(inputList);
    const lastNumbers = [];

    for (const line of lines) {
        lastNumbers.push(getLastNumber(line));
    }

    const sumOfLast = lastNumbers.reduce((a, c) => a + c);

    const end = performance.now();
    const duration = Math.round((end - start) * 10) / 10;
    console.log(`Sum: ${sumOfLast} \nDuration: ${duration}ms`);
}

void main();