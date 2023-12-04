import { getInput } from './utils';

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

    const returnCards = new Map<number, CardModel[]>();
    for (const card of cardModels) {
        const cards: CardModel[] = [];
        for (let i = 0; i < card.matchNumbersCount; i++) {
            const copy = cardModels[card.id + i];
            if (copy) {
                cards.push(copy);
            }
        }
        returnCards.set(card.id, cards);
    }

    let totalScratchCards = cardModels.length;

    let queue = [ ...cardModels ];
    while (queue.length > 0) {
        const current = queue.pop();
        if (current) {
            const newCards = returnCards.get(current.id);
            if (newCards && newCards.length > 0) {
                queue.push(...newCards);
                totalScratchCards += newCards.length;
            }
        }
    }

    console.log(totalScratchCards); 
}

void main();