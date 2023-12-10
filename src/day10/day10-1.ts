import { getInput } from '../utils';

type Node = {
    value: string;
    next: Node | null;
}

const getGrid = (value: string[]): string[][] => value.map((v) => v.split(''));

const getStartCord = (grid: string[][]): number[] => {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[i][j] === 'S') {
                return [i, j];
            }
        }
    }
    return [0, 0];
}

const getStartPipe = (grid: string[][], [row, col]: number[]): string | null => {
    const [top, right, bottom, left] = [
        row > 0 ? grid[row - 1][col] : null,
        col < grid[0].length - 1 ? grid[row][col + 1] : null,
        row < grid.length - 1 ? grid[row + 1][col] : null,
        col > 0 ? grid[row][col - 1] : null,
    ];

    if (top && right) {
        if ((top === '|' || top === 'F' || top === '7') && (right === '-' || right === 'J' || right === '7')) {
            return 'L';
        }
    } 

    if (top && bottom) {
        if ((top === '|' || top === 'F' || top === '7') && (bottom === '|' || bottom === 'L' || bottom === 'J')) {
            return '|';
        }
    } 

    if (top && left) {
        if ((top === '|' || top === 'F' || top === '7') && (left === '-' || left === 'F'|| left === 'L')) {
            return 'J';
        }
    } 

    if (right && bottom) {
        if ((right === '-' || right === 'J' || right === '7') && (bottom === '|' || bottom === 'L' || bottom === 'J')) {
            return 'F';
        }
     } 

    if (right && left) {
        if ((right === '-' || right === 'J' || right === '7') && (left === '-' || left === 'F' || left === 'L')) {
            return '-';
        }
    } 

    return null;
}

const getNextPipe = (grid: string[][], [row, col]: number[], [pRow, pCol]: number[]): [row: number, col: number]  => {
    const curr = grid[row][col];
    const [top, right, bottom, left] = [
        row > 0 ? grid[row - 1][col] : null,
        col < grid[0].length - 1 ? grid[row][col + 1] : null,
        row < grid.length - 1 ? grid[row + 1][col] : null,
        col > 0 ? grid[row][col - 1] : null,
    ];

    if (row === pRow && col === pCol) {
        if (curr === 'F' || curr === '-' && right) {
            return [row, col + 1];
        }
        if (curr === 'F' && bottom) {
            return [row + 1, col];
        }
        if (curr === '|' && top) {
            return [row - 1, col];
        }
        if (curr === '|' && bottom) {
            return [row + 1, col];
        }
        if (curr === '7' && bottom) {
            return [row + 1, col];
        }
        if (curr === '7' && left) {
            return [row, col - 1];
        }
        if (curr === '-' && right) {
            return [row, col + 1];
        }
        if (curr === '-' && left) {
            return [row, col - 1];
        }
        if (curr === 'J' && left) {
            return [row, col - 1];
        }
        if (curr === 'J' && top) {
            return [row - 1, col];
        }
    }

    if (curr === '|') {
        if (pRow < row) {
            return [row + 1, col];
        } else {
            return [row - 1, col]
        }
    }

    if (curr === '-') {
        if (pCol < col) {
            return [row, col + 1];
        } else {
            return [row, col - 1]
        }
    }

    if (curr === '7') {
        if (pRow === row) {
            return [row + 1, col];
        } else {
            return [row, col - 1]
        }
    }

    if (curr === 'J') {
        if (pRow === row) {
            return [row - 1, col];
        } else {
            return [row , col - 1]
        }
    }

    if (curr === 'L') {
        if (pRow === row) {
            return [row - 1, col];
        } else {
            return [row, col + 1]
        }
    }

    if (curr === 'F') {
        if (pRow === row) {
            return [row + 1, col];
        } else {
            return [row, col + 1]
        }
    }
    
    return [row, col]
};

const getLinkedListFromStart = (grid: string[][], [startRow, startCol]: number[]): number => {
    const visited = new Map<string, boolean>();
    grid[startRow][startCol] = getStartPipe(grid, [startRow, startCol])
    const startNode: Node = { 
        value: grid[startRow][startCol], 
        next: null,
     };

    let prevPos: number[] = [startRow, startCol];
    let currentNode: Node | null = startNode;
    let currentPos: number[] = [startRow, startCol];
    let steps = 0;

    while (currentNode !== null) {
        const [row, col] = currentPos;
        const [prevRow, prevCol] = prevPos;
        const currentKey = `${row}-${col}`;
        visited.set(currentKey, true);
        steps++;
        const nextPipeCords = getNextPipe(grid,[row, col], [prevRow, prevCol]);
        const nextKey = `${nextPipeCords[0]}-${nextPipeCords[1]}`;
        if (visited.has(nextKey)) {
            break;
        }
        currentNode.next = { value: grid[nextPipeCords[0]][nextPipeCords[1]], next: null };
        currentNode = currentNode.next;
        prevPos = [row, col];
        currentPos = [nextPipeCords[0], nextPipeCords[1]];
    }

    return steps;
};

async function main() {
    const start = performance.now();
    const inputList = getInput('test2.txt');
    const grid = getGrid(inputList);
    const startCord = getStartCord(grid);
    const steps = getLinkedListFromStart(grid, startCord);
    const result = steps / 2;
    const end = performance.now();
    const duration = Math.round((end - start) * 10) / 10;
    console.log(`Steps: ${result} \nDuration: ${duration}ms`);
}

void main();