import { getInput } from '../utils';

const transposeMatrix = (matrix: string[]): string[] => {
    let transposedMatrix: string[] = [];

    for (let i = 0; i < matrix[0].length; i++) {
        let transposedRow: string = '';
        for (let j = 0; j < matrix.length; j++) {
            transposedRow += matrix[j][i];
        }
        transposedMatrix.push(transposedRow);
    }

    return transposedMatrix;
}

const getMergedArrays = (a: string[], b: string[]): [string, string][] => {
    const mergedArray: [string, string][] = [];

    for (let i = 0; i < a.length; i++) {
        mergedArray.push([a[i], b[i]])
    }

    return mergedArray;
}

const calculateLinesDifference = (left: string, right: string): number => {
    const leftValue = left.split('');
    const rightValue = right.split('');
    const mergedArrays = getMergedArrays(leftValue, rightValue);
    return mergedArrays.filter(([l, r]) => l !== r).length;
}

const calculateMirrorDifference = (matrix: string[], row: number): number => {
    let difference: number = 0;
    const length = Math.min(row, matrix.length - row - 2) + 1;

    for (let i = 0; i < length; i++) {
        const left = matrix[row - i];
        const right = matrix[row + i + 1];
        difference += calculateLinesDifference(left, right);
    }

    return difference;
}

const findMirrorPosition = (matrix: string[]): number => {
    for (let i = 0; i < matrix.length - 1; i++) {
        const diff = calculateMirrorDifference(matrix, i);
        if (diff === 1) {
            return i;
        }
    }
    return -1;
}

const calculateRowPosition = (matrix: string[]): number => {
    const rowPos = findMirrorPosition(matrix);
    return (rowPos + 1) * 100;
}

const calculateColumnPosition = (matrix: string[]): number => {
    const transposedMatrix = transposeMatrix(matrix);
    const colPos = findMirrorPosition(transposedMatrix);
    return colPos + 1;
}

const processMatrixRow = (matrix: string[]): number => {
    const rowPos = calculateRowPosition(matrix);
    const colPos = calculateColumnPosition(matrix);
    return rowPos + colPos;
}

async function main() {
    const start = performance.now();
    const inputList: string[] = getInput('input.txt');

    const mirrors: string[][] = inputList.map((inp) => inp.split('\n'));
    let result: number = 0;
    for (let i = 0; i < mirrors.length; i++) {
        result += processMatrixRow(mirrors[i]);
    }

    const end = performance.now();
    const duration: number = Math.round((end - start) * 10) / 10;
    console.log(`Sum: ${result} \nDuration: ${duration}ms`);
}

void main();