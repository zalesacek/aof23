import { getInput } from '../utils';

const getHistoryLine = (value: string[]) => value.map((str) => str.split(' ').map(Number));

const getFirstNumber = (line: number[]): number => {
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
        const first1 = sequences[idx][0];
        const first2 = sequences[idx - 1][0];
        sequences[idx - 1].unshift(first2 - first1);
    }

    return sequences[0][0];
}

async function main() {
    const start = performance.now();
    const inputList = getInput('input.txt');
    const lines = getHistoryLine(inputList);
    const firstNumbers = [];

    for (const line of lines) {
        firstNumbers.push(getFirstNumber(line));
    }

    const sumOfLast = firstNumbers.reduce((a, c) => a + c);

    const end = performance.now();
    const duration = Math.round((end - start) * 10) / 10;
    console.log(`Sum: ${sumOfLast} \nDuration: ${duration}ms`);
}

void main();