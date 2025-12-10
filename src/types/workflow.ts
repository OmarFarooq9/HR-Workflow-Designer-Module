import { Node, Edge } from 'reactflow';

export type NodeType = 'start' | 'task' | 'approval' | 'automated' | 'end';

export interface BaseNodeData extends Record<string, unknown> {
    label: string;
    type: NodeType;
}

export interface StartNodeData extends BaseNodeData {
    type: 'start';
    metadata?: Record<string, string>;
}

export interface TaskNodeData extends BaseNodeData {
    type: 'task';
    description?: string;
    assignee?: string;
    dueDate?: string;
    customFields?: Record<string, string>;
}

export interface ApprovalNodeData extends BaseNodeData {
    type: 'approval';
    approverRole?: string;
    autoApproveThreshold?: number;
}

export interface AutomatedNodeData extends BaseNodeData {
    type: 'automated';
    actionId?: string;
    actionParams?: Record<string, any>;
}

export interface EndNodeData extends BaseNodeData {
    type: 'end';
    endMessage?: string;
    isSummary?: boolean;
}

export type WorkflowNodeData =
    | StartNodeData
    | TaskNodeData
    | ApprovalNodeData
    | AutomatedNodeData
    | EndNodeData;

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

export interface AutomationAction {
    id: string;
    label: string;
    params: string[];
}
