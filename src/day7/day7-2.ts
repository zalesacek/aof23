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
    'T': 10,
    '9': 9,
    '8': 8,
    '7': 7,
    '6': 6,
    '5': 5,
    '4': 4,
    '3': 3,
    '2': 2,
    'J': 1,
};

const calculateHandKind = (counts: number[]) => {
    let values = [...counts];
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

const getHandKind = (cards: string[]) => {
    let counts: { [key: string]: number } = {};

    for(let i = 0; i < cards.length; i++) {
        if(counts[cards[i]]) {
            counts[cards[i]]++;
        } else {
            counts[cards[i]] = 1;
        }
    }

    if(cards.includes('J')) {
        let bestHandKind = HandKind.highCard;
        let allCards = Object.keys(cardOrder);
        for(let i = 0; i < allCards.length; i++) {
            let tempCards = [...cards];
            for(let j = 0; j < tempCards.length; j++) {
                if(tempCards[j] === 'J') {
                    tempCards[j] = allCards[i];
                }
            }
            let tempCounts: { [key: string]: number } = {};
            for(let k = 0; k < tempCards.length; k++) {
                if(tempCounts[tempCards[k]]) {
                    tempCounts[tempCards[k]]++;
                } else {
                    tempCounts[tempCards[k]] = 1;
                }
            }
            let handKind = calculateHandKind(Object.values(tempCounts));
            if(handKindOrder[handKind] > handKindOrder[bestHandKind]) {
                bestHandKind = handKind;
            }
        }
        return bestHandKind;
    } else {
        return calculateHandKind(Object.values(counts));
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

    for (let i = 0; i < orderedHands.length; i++) {
        const hand = orderedHands[i];
        totalWin += hand.bid * (i + 1);
    }

    const end = performance.now();
    const duration = Math.round((end - start) * 10) / 10;

    console.log(`Total win: ${totalWin} \nDuration: ${duration}ms`);
}

void main();