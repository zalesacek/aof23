import { getInput } from './utils';

type Row = {
    id: number,
    items: string[],
}

const getRows = (input: string[]): Row[] => {
    const rows: Row[] = [];

    for (let i = 0; i < input[0].length; i++) {
        const temp: string[] = [];

        for (let j = 0; j < input.length; j++) {
            const current = input[j][i];
            temp.push(current);
        }

        rows.push({
            id: i + 1,
            items: temp,
        });
    }

    return rows;
}

const weightedRows = (row: Row): Row => {
    for (let i = 0; i < row.items.length; i++) {
        for (let j = i + 1; j < row.items.length; j++) {
            if (row.items[j] === '#') {
                break;
            }
            if (row.items[i] === '.' && row.items[j] === 'O') {
                [row.items[i], row.items[j]] = [row.items[j], row.items[i]]
            }
        }
    }

    return row;
}

async function main() {
    const start = performance.now();
    const inputList = getInput('input.txt');
   
    const rowsLength = inputList.length;
    const rows = getRows(inputList);
    const updatedRows: Row[] = [];

    for (const row of rows) {
        updatedRows.push(weightedRows(row));
    }

    let index = 0;
    let sum = 0;
    for (let i = rowsLength; i > 0; i--) {
        for (const row of rows) {
            const current = row.items[index];
            if (current === 'O') {
                sum += i;
            }
        }
        index++;
    }
   

    const end = performance.now();
    const duration = Math.round((end - start) * 10) / 10;
    console.log(`Sum: ${sum} \nDuration: ${duration}ms`);
}

void main();