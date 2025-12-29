import { LLMService } from './llm';
import { NodeType, EdgeType } from '../types/graph';

export interface ExtractedData {
    nodes: {
        type: NodeType;
        name: string;
        properties: any;
    }[];
    edges: {
        source: string;
        target: string;
        type: EdgeType;
        properties: any;
    }[];
}

export class ExtractionAgent {
    private llm: LLMService;

    constructor(llm: LLMService) {
        this.llm = llm;
    }

    async extract(text: string): Promise<ExtractedData> {
        const prompt = `
      Analyze the following academic paper text and extract a knowledge graph.
      
      Identify the following entities (Nodes):
      - PAPER: The paper itself (if the text is a full paper, use the title).
      - CONCEPT: Key ideas or theories.
      - AUTHOR: Authors of the paper.
      - METHOD: Specific techniques or algorithms proposed or used.
      - METRIC: Evaluation metrics used.
      - DATASET: Datasets used for evaluation.
      - INSTITUTION: Affiliations.

      Identify the following relationships (Edges):
      - CITES: Paper A cites Paper B.
      - INTRODUCES: Paper introduces Method/Concept.
      - IMPROVES_ON: Method A improves on Method B.
      - USES: Method A uses Concept/Method B.
      - EVALUATES_ON: Method evaluates on Dataset.
      - AUTHORED_BY: Paper authored by Author.
      - AFFILIATED_WITH: Author affiliated with Institution.

      Return the result as a JSON object with "nodes" and "edges" arrays.
      Each node should have: "type", "name", "properties".
      Each edge should have: "source" (name of source node), "target" (name of target node), "type", "properties".
      
      Text to analyze:
      ${text.substring(0, 15000)} ... (truncated)
    `;

        const result = await this.llm.complete(prompt);
        try {
            return JSON.parse(result) as ExtractedData;
        } catch (e) {
            console.error("Failed to parse LLM output", e);
            return { nodes: [], edges: [] };
        }
    }
}
