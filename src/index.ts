import { initDb, closeDb } from './db';
import { Pipeline } from './pipeline';
import { OpenAILLMService } from './agents/llm';
import { GraphRepository } from './db/repository';
import { MockGraphRepository } from './db/mock_repository';
import * as path from 'path';

async function main() {
    try {
        console.log('Starting Academic Knowledge Graph Agent...');

        let repo: GraphRepository | MockGraphRepository;

        if (process.env.USE_MOCK_DB === 'true') {
            console.log('Using MOCK Database Repository.');
            repo = new MockGraphRepository();
        } else {
            try {
                await initDb();
                repo = new GraphRepository();
            } catch (e) {
                console.warn('Failed to connect to real DB, falling back to MOCK DB.');
                repo = new MockGraphRepository();
            }
        }

        const llm = new OpenAILLMService(process.env.OPENAI_API_KEY || '');
        // @ts-ignore - Interface compatibility for PoC
        const pipeline = new Pipeline(llm, repo);

        // Run on sample data
        const samplePath = path.join(__dirname, '../data/sample_paper.txt');
        await pipeline.processPaper(samplePath);

        console.log('System finished successfully.');

        if (repo instanceof MockGraphRepository) {
            console.log('Mock DB State:', JSON.stringify(repo.getData(), null, 2));
        }

    } catch (error) {
        console.error('Execution failed:', error);
        process.exit(1);
    } finally {
        if (process.env.USE_MOCK_DB !== 'true') {
            await closeDb().catch(() => { });
        }
    }
}

if (require.main === module) {
    main();
}
