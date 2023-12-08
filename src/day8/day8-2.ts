import { getInput } from '../utils';

type Node = {
    id: string,
    left: string,
    right: string,
}

type NodeMap = {
    [key: string]: Node
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

const getMapFromArray = (nodes: Node[]): NodeMap => {
    const nodeMap: NodeMap = {};
    for (let node of nodes) {
        nodeMap[node.id] = node;
    }
    return nodeMap;
}

const gcd = (a: number, b: number): number => {
    if (!b) return a;
    return gcd(b, a % b);
};

const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);

async function main() {
    const start = performance.now();
    const inputList = getInput('input.txt');

    const directions = getDirection(inputList[0]);
    const nodes = getNodes(inputList);
    const nodesMap = getMapFromArray(nodes);

    const startNodes: string[] = [];
    for (const key in nodesMap) {
        if (key.endsWith('A')) {
            startNodes.push(key);
        }
    }

    const nodesSteps = startNodes.map((node) => {
        let steps = 0;
        let reachedEnd = false;
        let index = 0;
        let lastNodeId = node;

        while (!reachedEnd) {
            if (index == directions.length) {
                index = 0;
            }
            const dir = directions[index];
            const curr = nodesMap[lastNodeId];
            const next = dir === 'L' ? curr.left : curr.right;
            index++;
            steps++;
            lastNodeId = next;
            if (next.endsWith('Z')) {
                reachedEnd = true;
            }
        }
        return steps;
    });

    const result = nodesSteps.reduce((a, c) => lcm(a, c), 1);

    const end = performance.now();
    const duration = Math.round((end - start) * 10) / 10;
    console.log(`Steps: ${result} \nDuration: ${duration}ms`);
}

void main();