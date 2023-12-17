import { getInput } from '../utils';

const getHashValue = (hash: string): number => {
    let hashValue = 0;

    for (let i = 0; i < hash.length; i++) {
        const char = hash[i];
        const code = char.charCodeAt(0);
        hashValue += code;
        hashValue = (hashValue * 17) % 256;
    }

    return hashValue;
}

async function main() {
    const start = performance.now();
    const inputList = getInput('input.txt');
   
    let sum = 0;
    for (const input of inputList) {
        const hashValue = getHashValue(input);
        sum += hashValue;
    }

    const end = performance.now();
    const duration = Math.round((end - start) * 10) / 10;
    console.log(`Sum: ${sum} \nDuration: ${duration}ms`);
}

void main();