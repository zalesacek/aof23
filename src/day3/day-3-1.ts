import { getInput } from '../utils';

type Cords = {
    row: number,
    col: number,
}

export function getSpecialCharCords (rows: string[][]): Map<string, Cords> {
    const charCords = new Map<string, Cords>();
    for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < rows[0].length; j++) {
            if (rows[i][j] !== '.' && isNaN(parseInt(rows[i][j]))) {
                charCords.set(`${i}-${j}`, { row: i, col: j});
            }
        }
    }
    return charCords;
}

export function isNumber(val: string): boolean {
    return !isNaN(parseInt(val));
}

export function getNumberAtLeft(visitedCords: Map<string, boolean>, grid: string[][], col: number, row: number): number {
    let values: string[] = [];

    for (let i = col; i >= 0; i--) {
        const cordString = `${row}-${i}`;
        if (!visitedCords.has(cordString)) {
            visitedCords.set(cordString, true);

            const v = grid[row][i];
            if (isNumber(v)) {
                values.unshift(v);
            } else {
                break;
            }
        } else {
            break;
        }
    }

    return parseInt(values.join(''));
}

export function getNumberAtRight(visitedCords: Map<string, boolean>, grid: string[][], col: number, row: number): number | null {
    let values: string[] = [];

    for (let i = col; i <= grid[0].length - 1; i++) {
        const cordString = `${row}-${i}`;

        if (!visitedCords.has(cordString)) {
            visitedCords.set(cordString, true);

            const v = grid[row][i];
            if (isNumber(v)) {
                values.push(v);
            } else {
                break;
            }
        } else {
            break;
        }
    }

    const number = parseInt(values.join(''));

    return isNaN(number) ? null : number;
}

export function findStartIndex(row: string[], entryIndex: number): number {
    let startIndex = entryIndex;
    while(startIndex !== 0) {
        const char = row[startIndex - 1];
        if (isNaN(parseInt(char))) {
            return startIndex;
        } else {
            startIndex--;
        }
    }
    return startIndex;
}

export function exploreGrid(grid: string[][], cords: Cords, visitedCords: Map<string, boolean>): number[] {
    const numbers: number[] = [];

    if (cords.col - 1 >= 0) {
        const left = grid[cords.row][cords.col - 1];
        if (isNumber(left)) {
            const number = getNumberAtLeft(visitedCords, grid, cords.col - 1, cords.row);
            if (number) {
                numbers.push(number);
            }
        }
    }

    if (cords.col + 1 <= grid[0].length - 1) {
        const right = grid[cords.row][cords.col + 1];
        if (isNumber(right)) {
            const number = getNumberAtRight(visitedCords, grid, cords.col + 1, cords.row);
            if (number) {
                numbers.push(number);
            }
        }
    }

    if (cords.row - 1 >= 0) {
        const top = grid[cords.row - 1][cords.col];

        if (isNumber(top)) {
            const startIndex = findStartIndex(grid[cords.row - 1], cords.col);
            const number = getNumberAtRight(visitedCords, grid, startIndex, cords.row - 1);
            if (number) {
                numbers.push(number);
            }
        }

        if (cords.col - 1 >= 0) {
            const topLeft = grid[cords.row - 1][cords.col - 1];
            if (isNumber(topLeft)) {
                const startIndex = findStartIndex(grid[cords.row - 1], cords.col - 1)
                const number = getNumberAtRight(visitedCords, grid, startIndex, cords.row - 1);
                if (number) {
                    numbers.push(number);
                }
            }
        }
        if (cords.col + 1 <= grid[0].length - 1) {
            const topRight = grid[cords.row - 1][cords.col + 1];
            if (isNumber(topRight)) {
                const startIndex = findStartIndex(grid[cords.row - 1], cords.col + 1);
                const number = getNumberAtRight(visitedCords, grid, startIndex, cords.row - 1);
                if (number) {
                    numbers.push(number);
                }
            }
        }
    }

    if (cords.row + 1 <= grid.length - 1) {
        const bottom = grid[cords.row + 1][cords.col];

        if (isNumber(bottom)) {
            const startIndex = findStartIndex(grid[cords.row + 1], cords.col)
            const number = getNumberAtRight(visitedCords, grid, startIndex, cords.row + 1);
            if (number) {
                numbers.push(number);
            }
        }

        if (cords.col - 1 >= 0) {
            const bottomLeft = grid[cords.row + 1][cords.col - 1];
            if (isNumber(bottomLeft)) {
                const startIndex = findStartIndex(grid[cords.row + 1], cords.col - 1)
                const number = getNumberAtRight(visitedCords, grid, startIndex, cords.row + 1);
                if (number) {
                    numbers.push(number);
                }
            }
        }
        if (cords.col + 1 <= grid[0].length - 1) {
            const bottomRight = grid[cords.row + 1][cords.col + 1];
            if (isNumber(bottomRight)) {
                const startIndex = findStartIndex(grid[cords.row + 1], cords.col + 1)
                const number = getNumberAtRight(visitedCords, grid, startIndex, cords.row + 1);
                if (number) {
                    numbers.push(number);
                }
            }
        }
    }

    return numbers;
}

export function getEngineNumbers(rows: string[][], charCords: Map<string, Cords>): number[] {
    const engineNumber: number[] = [];
    const visitedCords = new Map<string, boolean>();

    for (const [key, cords] of charCords) {
        engineNumber.push(...exploreGrid(rows, cords, visitedCords));
    }

    return engineNumber;
}

async function main() {
    const inputList = getInput('test.txt');

    const rows: string[][] = [];
    inputList.map((r) => rows.push( r.split('')))

    const charCords = getSpecialCharCords(rows);
    const engineNumbers = getEngineNumbers(rows, charCords);
    const summary = engineNumbers.reduce((sum, curr) => sum += curr);

    console.log(summary);
}

void main();
