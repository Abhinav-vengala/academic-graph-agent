import * as fs from 'fs';
import * as path from 'path';

export class FileLoader {
    async loadFile(filePath: string): Promise<string> {
        try {
            const absolutePath = path.resolve(filePath);
            const content = fs.readFileSync(absolutePath, 'utf-8');
            return content;
        } catch (error) {
            console.error(`Error reading file ${filePath}:`, error);
            throw error;
        }
    }
}
