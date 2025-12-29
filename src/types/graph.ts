export type NodeType =
    | 'PAPER'
    | 'CONCEPT'
    | 'AUTHOR'
    | 'METHOD'
    | 'METRIC'
    | 'DATASET'
    | 'INSTITUTION';

export type EdgeType =
    | 'CITES'
    | 'INTRODUCES'
    | 'IMPROVES_ON'
    | 'USES'
    | 'EVALUATES_ON'
    | 'AUTHORED_BY'
    | 'AFFILIATED_WITH';

export interface Node {
    id?: string;
    type: NodeType;
    name: string;
    properties: Record<string, any>;
    created_at?: Date;
    updated_at?: Date;
}

export interface Edge {
    id?: string;
    source_id: string;
    target_id: string;
    type: EdgeType;
    properties: Record<string, any>;
    created_at?: Date;
}

export interface GraphData {
    nodes: Node[];
    edges: Edge[];
}
