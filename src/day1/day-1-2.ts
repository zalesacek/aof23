import { getInput } from '../utils';

function getValues(string: string): number {
    let firstDigit;
    let lastDigit;

    string = string.replaceAll('one', 'one1one');
    string = string.replaceAll('two', 'two2two');
    string = string.replaceAll('three', 'three3three');
    string = string.replaceAll('four', 'four4four');
    string = string.replaceAll('five', 'five5five');
    string = string.replaceAll('six', 'six6six');
    string = string.replaceAll('seven', 'seven7seven');
    string = string.replaceAll('eight', 'eight8eight');
    string = string.replaceAll('nine', 'nine9nine');

    for (let i = 0; i < string.length; i++) {
        if (!isNaN(parseInt(string[i]))) {
            firstDigit = parseInt(string[i]);
            break;
        }
    }

    for (let i = string.length - 1; i >= 0; i--) {
        if (!isNaN(parseInt(string[i]))) {
            lastDigit = parseInt(string[i]);
            break;
        }
    }

    return parseInt(`${firstDigit}${lastDigit}`);
}

async function main() {
    const inputList = getInput('input-1.txt');
    const digits: number[] = [];

    inputList.map((inp, i) => {
        const num = getValues(inp);
        digits.push(num);
    });

    const sum = digits.reduce((sum, curr) => sum + curr);

    console.log(sum);
}

void main();
