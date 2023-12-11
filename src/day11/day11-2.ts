import { getInput } from '../utils';

type Cord = {
    row: number,
    col: number,
}

type Node = {
    id: number,
    cord: Cord;
};

type ExpandedResponse = { emptyRows: number[], emptyCols: number[] }

const getCord = (grid: string[][], applyNumbers = false): Map<string, Node> => {
    const cords = new Map<string, Node>();
    let index = 1;
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            if (grid[row][col] === '#') {
                const key = `${row}-${col}`;
                cords.set(key, {
                    id: index,
                    cord: { row, col }
                });
                if (applyNumbers) {
                    grid[row][col] = index.toString();
                }
                index++
            }
        }
    }
    return cords;
}

const getExpandedGrid = (grid: string[][], cordsKeys: string[]): ExpandedResponse => {
    const rowKeys = cordsKeys.map(key => parseInt(key.split('-')[0]));
    const colKeys = cordsKeys.map(key => parseInt(key.split('-')[1]));

    let emptyRows = [];
    for (let row = 0; row < grid.length; row++) {
        if (!rowKeys.includes(row)) {
            emptyRows.push(row);
        }
    }

    let emptyCols = []
    for (let col = grid[0].length - 1; col >= 0; col--) {
        if (!colKeys.includes(col)) {
            emptyCols.push(col);
        }
    }

    return { emptyRows, emptyCols };
}

const getShortestPath = (start: Cord, end: Cord) => Math.abs(start.row - end.row) + Math.abs(start.col - end.col);

function updateNodes(startNode: Node, endNode: Node, empty: ExpandedResponse, offset: number) {
    const { emptyRows, emptyCols } = empty;

    let newStartNode = JSON.parse(JSON.stringify(startNode));
    let newEndNode = JSON.parse(JSON.stringify(endNode));

    let addStartCols = 0;
    let addStartRows = 0;
    let addEndCols = 0;
    let addEndRows = 0;

    for (const eR of emptyRows) {
        if (startNode.cord.row > eR) {
            addStartRows++;
        }
        if (endNode.cord.row > eR) {
            addEndRows++;
        }
    }
    for (const eC of emptyCols) {
        if (startNode.cord.col > eC) {
            addStartCols++;
        }
        if (endNode.cord.col > eC) {
            addEndCols++;
        }
    }

    newStartNode.cord.row = startNode.cord.row + (offset * addStartRows);
    newStartNode.cord.col = startNode.cord.col + (offset * addStartCols);
    newEndNode.cord.row = endNode.cord.row + (offset * addEndRows);
    newEndNode.cord.col = endNode.cord.col + (offset * addEndCols);

    return { newStartNode, newEndNode };
}

async function main() {
    const start = performance.now();
    const inputList = getInput('input.txt');
    const grid: string[][] = inputList.map((line) => line.split(''));
    const cords = getCord(grid);
    const cordsKeys = [...cords.keys()];
    const expandedGrid: ExpandedResponse = getExpandedGrid(grid, cordsKeys);
    const shortestPaths: number[] = [];
    for (let i = 0; i < cordsKeys.length; i++) {
        for (let j = i + 1; j < cordsKeys.length; j++) {
            const start = cords.get(cordsKeys[i]);
            const end = cords.get(cordsKeys[j]);
            if (start && end) {
                const result = updateNodes(start, end, expandedGrid, 999999);
                shortestPaths.push(getShortestPath(result.newStartNode.cord, result.newEndNode.cord));
            }
        }
    }
    const sum = shortestPaths.reduce((a, c) => a + c);
    const end = performance.now();
    const duration = Math.round((end - start) * 10) / 10;
    console.log(`Sum: ${sum} \nDuration: ${duration}ms`);
}

void main();