export interface Node {
    id: string;
    fname: string;
    outputs?: string[];
    inputs?: string[];
    widget_inputs?: Record<string, any>;
}

export interface Link {
    source: string;
    target: string;
    source_handle: number;
    target_handle: string;
    key?: number;
}

export interface Graph {
    directed: boolean;
    multigraph: boolean;
    graph: Record<string, any>;
    nodes: Node[];
    links: Link[];
}