import { getInput } from '../utils';

type Node = {
    value: string;
    key: string;
    row: number;
    col: number;
    next: Node | null;
}

const ExpandedNodeMap = new Map<string, string[][]>([
    ['.', [['.', '.', '.'], ['.', '.', '.'], ['.', '.', '.']]],
    ['-', [['.', '.', '.'], ['-', '-', '-'], ['.', '.', '.']]],
    ['|', [['.', '|', '.'], ['.', '|', '.'], ['.', '|', '.']]],
    ['F', [['.', '.', '.'], ['.', '-', '-'], ['.', '|', '.']]],
    ['J', [['.', '|', '.'], ['-', '-', '.'], ['.', '.', '.']]],
    ['7', [['.', '.', '.'], ['-', '-', '.'], ['.', '|', '.']]],
    ['L', [['.', '|', '.'], ['.', '-', '-'], ['.', '.', '.']]],
]);

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

const getLinkedListFromStart = (grid: string[][], [startRow, startCol]: number[], visited: Map<string, boolean>): Node | null => {
    grid[startRow][startCol] = getStartPipe(grid, [startRow, startCol])
    const startNode: Node = { 
        value: grid[startRow][startCol], 
        key: `${startRow}-${startCol}`,
        row: startRow,
        col: startCol,
        next: null,
     };

    let prevPos: number[] = [startRow, startCol];
    let currentNode: Node | null = startNode;
    let currentPos: number[] = [startRow, startCol];

    while (currentNode !== null) {
        const [row, col] = currentPos;
        const [prevRow, prevCol] = prevPos;
        const currentKey = `${row}-${col}`;
        visited.set(currentKey, true);
        const nextPipeCords = getNextPipe(grid,[row, col], [prevRow, prevCol]);
        const nextKey = `${nextPipeCords[0]}-${nextPipeCords[1]}`;
        if (visited.has(nextKey)) {
            break;
        }
        currentNode.next = { 
            value: grid[nextPipeCords[0]][nextPipeCords[1]], 
            key: `${nextPipeCords[0]}-${nextPipeCords[1]}`,
            row: nextPipeCords[0],
            col: nextPipeCords[1],
            next: null,
        };
        currentNode = currentNode.next;
        prevPos = [row, col];
        currentPos = [nextPipeCords[0], nextPipeCords[1]];
    }

    return startNode;
};

const getExpandedGrid = (grid: string[][]): string[][] => {
    const expanded = Array.from({ length: grid.length * 3 }, (_) => Array.from({ length: grid[0].length * 3 }, () => 'x'))
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[0].length; col++) {
            const cell = grid[row][col];
            const expansion = ExpandedNodeMap.get(cell)!;
            for (let i = 0; i < 3; i++) {
                const targetRow = row * 3 + i;
                const targetColStart = col * 3;
                expanded[targetRow].splice(targetColStart, 3, ...expansion[i]);
            }
        }
    }
    return expanded
}

function* getNeighbors(grid: string[][], start: [number, number]): Generator<[number, number]> {
    for (const [x, y] of [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
    ] as [number, number][]) {
        const neighbor: [number, number] = [start[0] + x, start[1] + y]
        if (neighbor[0] >= 0 && neighbor[1] >= 0 && neighbor[1] < grid.length && neighbor[0] < grid[0].length) {
            yield neighbor
        }
    }
}

const floodFill = (grid: string[][], start: [number, number], visited: Set<string>): void => {
    const queue: [number, number][] = [start]
    while (queue.length > 0) {
        const point = queue.shift()!
        if (visited.has(point.toString()) || grid[point[1]][point[0]] !== '.') continue;
 
        grid[point[1]][point[0]] = ' ';
        visited.add(point.toString());
 
        for (const neighbor of getNeighbors(grid, point)) {
            queue.push(neighbor)
        }
    }
}

const isDotArea = (expanded: string[][], row: number, col: number): boolean => {
    for (let i = col; i < col + 3; i++) {
        for (let j = row; j < row + 3; j++) {
            if (expanded[i][j] !== '.') return false;
        }
    }
    return true;
}

async function main() {
    const start = performance.now();
    const inputList = getInput('input.txt');
    const grid = getGrid(inputList);
    const startCord = getStartCord(grid);
    const visited = new Map<string, boolean>();
    getLinkedListFromStart(grid, startCord, visited);
    let count = 0;
    const expandedGrid = getExpandedGrid(grid)
    const floodVisited = new Set<string>()
    floodFill(expandedGrid, [0, 0], floodVisited);

    // console.log(expandedGrid.map(l => l.join('')))

    for (let y = 0; y < expandedGrid.length; y += 3) {
        for (let x = 0; x < expandedGrid[0].length; x += 3) {
            if (isDotArea(expandedGrid, x, y)) {
                count++
            }
        }
    }

    const end = performance.now();
    const duration = Math.round((end - start) * 10) / 10;
    console.log(`Sum: ${count} \nDuration: ${duration}ms`);
}

void main();