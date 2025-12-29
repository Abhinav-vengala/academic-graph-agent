import { query } from './index';
import { Node, Edge, NodeType, EdgeType } from '../types/graph';

export class GraphRepository {
    async createNode(type: NodeType, name: string, properties: any = {}): Promise<string> {
        const sql = `
      INSERT INTO nodes (type, name, properties)
      VALUES ($1, $2, $3)
      RETURNING id
    `;
        const res = await query(sql, [type, name, properties]);
        return res.rows[0].id;
    }

    async findNodeByName(name: string): Promise<Node | null> {
        const sql = `SELECT * FROM nodes WHERE name = $1`;
        const res = await query(sql, [name]);
        return res.rows[0] || null;
    }

    async createEdge(sourceId: string, targetId: string, type: EdgeType, properties: any = {}): Promise<string> {
        const sql = `
      INSERT INTO edges (source_id, target_id, type, properties)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (source_id, target_id, type) DO UPDATE SET properties = $4
      RETURNING id
    `;
        const res = await query(sql, [sourceId, targetId, type, properties]);
        return res.rows[0].id;
    }

    async getAllNodes(): Promise<Node[]> {
        const sql = `SELECT * FROM nodes`;
        const res = await query(sql);
        return res.rows;
    }

    async getAllEdges(): Promise<Edge[]> {
        const sql = `SELECT * FROM edges`;
        const res = await query(sql);
        return res.rows;
    }
}
