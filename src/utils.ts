import { readFileSync } from 'fs';
import path from 'path';

export function getInput(filename: string): string[] {
    const filePath = path.resolve(__dirname, filename);
    const content = readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').filter(Boolean);
    return lines;
}