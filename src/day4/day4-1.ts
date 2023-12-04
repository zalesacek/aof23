import { getInput } from '../utils';

type CardModel = {
    id: number,
    winNumbers: number[],
    scratchNumbers: number[],
    matchNumbers: number[],
}

function getNumbersFromString(input: string[]): number[] {
    return input.map((char) => parseInt(char.trim())).filter(Boolean);
}

function getCardModel(input: string): CardModel {
    const parts = input.split(':');
    const cardId = parseInt(parts[0].split(' ')[1]);
    const numSets = parts[1].split(' | ');
    const winNumbers = getNumbersFromString(numSets[0].split(' '));
    const scratchNumbers = getNumbersFromString(numSets[1].split(' '));
    const matchNumbers = scratchNumbers.filter((n) => winNumbers.includes(n));
    return {
        id: cardId,
        winNumbers,
        scratchNumbers,
        matchNumbers,
    }
}

function getCardPoints(card: CardModel): number {
    if (card.matchNumbers.length === 0) return 0;
    if (card.matchNumbers.length === 1) return 1;
    let points = 1;

    for (let i = 0; i < card.matchNumbers.length - 1; i++) {
        points *= 2;
    }
    return points;
}

async function main() {
    const inputList = getInput('test.txt');

    const cardModels = inputList.map(getCardModel);
    let sumPoints = 0;
    for (const card of cardModels) {
        sumPoints += getCardPoints(card);
    }

    console.log(sumPoints);
}

void main();
