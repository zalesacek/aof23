import { getInput } from '../utils';

type Cord = {
    row: number,
    col: number,
}

type Node = {
    id: number,
    cord: Cord;
};

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
                    index++
                }
            }
        }
    }
    return cords;
}

const getExpandedGrid = (grid: string[][], cordsKeys: string[]): string[][] => {
    const expandedGrid: string[][] = [];
    const rowKeys = cordsKeys.map(key => parseInt(key.split('-')[0]));
    const colKeys = cordsKeys.map(key => parseInt(key.split('-')[1]));

    for (let row = 0; row < grid.length; row++) {
        expandedGrid.push([...grid[row]]);
        if (!rowKeys.includes(row)) {
            expandedGrid.push([...grid[row]]);
        }
    }

    for (let col = expandedGrid[0].length - 1; col >= 0; col--) {
        if (!colKeys.includes(col)) {
            expandedGrid.forEach((line) => {
                line.splice(col, 0, '.');
            });
        }
    }

    return expandedGrid;
}

const getShortestPath = (start: Cord, end: Cord) => Math.abs(start.row - end.row) + Math.abs(start.col - end.col);

async function main() {
    const start = performance.now();
    const inputList = getInput('input.txt');
    const grid: string[][] = inputList.map((line) => line.split(''));
    const cords = getCord(grid);
    const cordsKeys = [...cords.keys()];
    const expandedGrid: string[][] = getExpandedGrid(grid, cordsKeys);
    const expandedGridCords = getCord(expandedGrid, true);
    const keys = Array.from(expandedGridCords.keys());
    const shortestPaths: number[] = [];
    for (let i = 0; i < keys.length; i++) {
        for (let j = i + 1; j < keys.length; j++) {
            const start = expandedGridCords.get(keys[i]);
            const end = expandedGridCords.get(keys[j]);
            if (start && end) {
                shortestPaths.push(getShortestPath(start.cord, end.cord));
            }
        }
    }
    const sum = shortestPaths.reduce((a, c) => a + c);
    const end = performance.now();
    const duration = Math.round((end - start) * 10) / 10;
    console.log(`Sum: ${sum} \nDuration: ${duration}ms`);
}

void main();

// NOT: 9531080