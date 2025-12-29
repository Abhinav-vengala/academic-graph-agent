import { Node, Edge, NodeType, EdgeType } from '../types/graph';
import { v4 as uuidv4 } from 'uuid'; // We might need to install uuid or just mock it

export class MockGraphRepository {
    private nodes: Node[] = [];
    private edges: Edge[] = [];

    async createNode(type: NodeType, name: string, properties: any = {}): Promise<string> {
        const id = `mock-uuid-${this.nodes.length + 1}`;
        this.nodes.push({ id, type, name, properties, created_at: new Date() });
        return id;
    }

    async findNodeByName(name: string): Promise<Node | null> {
        return this.nodes.find(n => n.name === name) || null;
    }

    async createEdge(sourceId: string, targetId: string, type: EdgeType, properties: any = {}): Promise<string> {
        const id = `mock-edge-${this.edges.length + 1}`;
        this.edges.push({ id, source_id: sourceId, target_id: targetId, type, properties, created_at: new Date() });
        return id;
    }

    async getAllNodes(): Promise<Node[]> {
        return this.nodes;
    }

    async getAllEdges(): Promise<Edge[]> {
        return this.edges;
    }

    getData() {
        return { nodes: this.nodes, edges: this.edges };
    }
}
