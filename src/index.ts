import { getInput } from './utils';

const getMatrix = (input: string[]): string[][] => {
    let matrix = [];

    for (let i = 0; i < input.length; i++) {
        const current = input[i];
        const temp: string[] = [];
        for (let j = 0; j < current.length; j++) {
            if (current[j] === '\\') {
                temp.push('1');
            } else {
                temp.push(current[j]);
            }
        }
        matrix.push(temp)
    }

    return matrix;
}

async function main() {
    const inputList = getInput('test.txt');
    const matrix = getMatrix(inputList);

    console.log(matrix);
}

void main();