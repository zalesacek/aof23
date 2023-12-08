import { getInput } from '../utils';

type HandBid = {
    hand: string[],
    bid: number,
    kind?: HandKind,
}

enum HandKind {
    fiveKind = 'fiveKind',
    fourKind = 'fourKind',
    threeKind = 'threeKind',
    fullHouse = 'fullHouse',
    twoPair = 'twoPair',
    onePair = 'onePair',
    highCard = 'highCard',
}

const handKindOrder = {
    [HandKind.fiveKind]: 6,
    [HandKind.fourKind]: 5,
    [HandKind.fullHouse]: 4,
    [HandKind.threeKind]: 3,
    [HandKind.twoPair]: 2,
    [HandKind.onePair]: 1,
    [HandKind.highCard]: 0,
};

const cardOrder: { [key: string]: number } = {
    'A': 13,
    'K': 12,
    'Q': 11,
    'J': 10,
    'T': 9,
    '9': 8,
    '8': 7,
    '7': 6,
    '6': 5,
    '5': 4,
    '4': 3,
    '3': 2,
    '2': 1,
};

const getHandKind = (cards: string[]) => {
    let counts: { [key: string]: number } = {};

    for(let i = 0; i < cards.length; i++) {
        if(counts[cards[i]]) {
            counts[cards[i]]++;
        } else {
            counts[cards[i]] = 1;
        }
    }

    let values = Object.values(counts);
    values.sort((a, b) => b - a);

    if(values[0] === 5) {
        return HandKind.fiveKind;
    } else if(values[0] === 4) {
        return HandKind.fourKind;
    } else if(values[0] === 3 && values[1] === 2) {
        return HandKind.fullHouse;
    } else if(values[0] === 3) {
        return HandKind.threeKind;
    } else if(values[0] === 2 && values[1] === 2) {
        return HandKind.twoPair;
    } else if(values[0] === 2) {
        return HandKind.onePair;
    } else {
        return HandKind.highCard;
    }
}

const getHands = (input: string[]): HandBid[] => {
    return input.map(item => {
        const [hand, bid] = item.split(' ');
        return {
            hand: hand.split(''),
            bid: parseInt(bid, 10)
        };
    });
}

const orderHands = (hands: HandBid[]) => {
    const ordered = hands.sort((a, b) => {
        if (handKindOrder[a.kind!] !== handKindOrder[b.kind!]) {
            return handKindOrder[a.kind!] - handKindOrder[b.kind!];
        }

        for (let i = 0; i < a.hand.length; i++) {
            if (cardOrder[a.hand[i]] !== cardOrder[b.hand[i]]) {
                return cardOrder[a.hand[i]] - cardOrder[b.hand[i]];
            }
        }

        return 0;
    });

    return ordered;
};

async function main() {
    const start = performance.now();
    const inputList = getInput('input.txt');

    const hands = getHands(inputList);
    const handsWithKind: HandBid[] = [];

    for (const hand of hands) {
        const res = getHandKind(hand.hand);
        handsWithKind.push({
            ...hand,
            kind: res,
        })
    }

    let totalWin = 0;

    const orderedHands = orderHands(handsWithKind);
    console.log(orderedHands);

    for (let i = 0; i < orderedHands.length; i++) {
        const hand = orderedHands[i];
        totalWin += hand.bid * (i + 1);
    }

    const end = performance.now();
    const duration = Math.round((end - start) * 10) / 10;

    console.log(`Total win: ${totalWin} \nDuration: ${duration}ms`);
}

void main();
