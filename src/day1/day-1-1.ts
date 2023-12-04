import { getInput } from '../utils';

async function main() {
    const inputList = getInput('input-1.txt');
    const digits: number[] = [];

    inputList.map((inp) => {
        const num = [];
        for (const char of inp) {
            if (!isNaN(parseInt(char))) {
                num.push(char);
            }
        }
        digits.push(parseInt(`${num[0]}${num[num.length - 1]}`));
    });

    const sum = digits.reduce((sum, curr) => sum + curr);

    console.log(sum);
}

void main();
