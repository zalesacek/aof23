import { getInput } from '../utils';

type Node = {
    id: string,
    left: string,
    right: string,
}

const getDirection = (value: string): string[] => value.split('');

const getNodes = (input: string[]): Node[] => input.slice(1).map(item => {
    const parts = item.split(' = ');
    const id = parts[0];
    const values = parts[1].replace('(', '').replace(')', '').split(', ');
    const left = values[0];
    const right = values[1];
    return { id, left, right };
});

const getMapFromArray = (nodes: Node[]): Map<string, Node> => {
    const nodeMap = new Map<string, Node>();
    for (let node of nodes) {
        nodeMap.set(node.id, node);
    }
    return nodeMap;
}

async function main() {
    const start = performance.now();
    const inputList = getInput('input.txt');

    const directions = getDirection(inputList[0]);
    const nodes = getNodes(inputList);
    const nodesMap = getMapFromArray(nodes);

    let step = 0;
    let reachedEnd = false;
    let index = 0;
    let lastNodeId = 'AAA';

    while(!reachedEnd) {
        if (index == directions.length) {
            index = 0;
        }
        const dir = directions[index];
        const curr = nodesMap.get(lastNodeId)!;
        const next = dir === 'L' ? curr.left : curr.right;
        index++;
        step++;
        lastNodeId = next;
        if (next === 'ZZZ') {
            reachedEnd = true;
        }
    }

    const end = performance.now();
    const duration = Math.round((end - start) * 10) / 10;
    console.log(`Steps: ${step} \nDuration: ${duration}ms`);
}

void main();