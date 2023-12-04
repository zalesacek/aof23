import { getInput } from '../utils';

type CardModel = {
    id: number,
    matchNumbersCount: number,
}

function getNumbersFromString(input: string[]): number[] {
    return input.map((char) => parseInt(char.trim())).filter(Boolean);
}

function getId(string: string): number {
    const parts = string.split(' ');
    return parseInt(parts[parts.length - 1]);
}

function getCardModel(input: string): CardModel {
    const parts = input.split(':');
    const cardId = getId(parts[0]);
    const numSets = parts[1].split(' | ');
    const winNumbers = getNumbersFromString(numSets[0].split(' '));
    const scratchNumbers = getNumbersFromString(numSets[1].split(' '));
    const matchNumbers = scratchNumbers.filter((n) => winNumbers.includes(n));
    return {
        id: cardId,
        matchNumbersCount: matchNumbers.length,
    }
}

async function main() {
    const inputList = getInput('input.txt');

    const cardModels = inputList.map(getCardModel);

    const copiesCount = new Array(cardModels.length).fill(0);
    let result = 0;
    let index = 0;

    for (let i = 0; i < cardModels.length; i++) {
        let addCopyIndex = index + 1;

        for (let j = 0; j < cardModels[i].matchNumbersCount; j++) {
            if (addCopyIndex < copiesCount.length) {
                copiesCount[addCopyIndex] = copiesCount[addCopyIndex] + copiesCount[index] + 1;
            } else {
                break;
            }
            addCopyIndex++;
        }

        console.log(`Card ${cardModels[i].id}, instances count: ${copiesCount[index] + 1}`);
        result += copiesCount[index] + 1;
        index++;
    }
    
    console.log(result);
}

void main();