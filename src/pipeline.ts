import { FileLoader } from './ingestion/loader';
import { ExtractionAgent } from './agents/extractor';
import { GraphRepository } from './db/repository';
import { LLMService } from './agents/llm';

export class Pipeline {
    private loader: FileLoader;
    private extractor: ExtractionAgent;
    private repo: GraphRepository;

    constructor(llm: LLMService, repo: GraphRepository) {
        this.loader = new FileLoader();
        this.extractor = new ExtractionAgent(llm);
        this.repo = repo;
    }

    async processPaper(filePath: string) {
        console.log(`Processing paper: ${filePath}`);

        // 1. Ingest
        const text = await this.loader.loadFile(filePath);
        console.log(`Loaded ${text.length} characters.`);

        // 2. Extract
        console.log('Extracting entities and relationships...');
        const data = await this.extractor.extract(text);
        console.log(`Extracted ${data.nodes.length} nodes and ${data.edges.length} edges.`);

        // 3. Construct Graph (Store in DB)
        console.log('Storing in database...');

        // Store Nodes
        const nodeNameMap = new Map<string, string>(); // Name -> UUID
        for (const node of data.nodes) {
            // Simple deduplication by name for this PoC
            const existing = await this.repo.findNodeByName(node.name);
            if (existing && existing.id) {
                nodeNameMap.set(node.name, existing.id);
            } else {
                const id = await this.repo.createNode(node.type, node.name, node.properties);
                nodeNameMap.set(node.name, id);
            }
        }

        // Store Edges
        for (const edge of data.edges) {
            const sourceId = nodeNameMap.get(edge.source);
            const targetId = nodeNameMap.get(edge.target);

            if (sourceId && targetId) {
                await this.repo.createEdge(sourceId, targetId, edge.type, edge.properties);
            } else {
                console.warn(`Skipping edge ${edge.source} -> ${edge.target} due to missing node IDs.`);
            }
        }

        console.log('Processing complete.');
    }
}
