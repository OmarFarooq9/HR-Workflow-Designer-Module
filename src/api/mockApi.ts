import { AutomationAction } from '../types/workflow';
import { Node, Edge } from 'reactflow';

const MOCK_AUTOMATIONS: AutomationAction[] = [
    { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
    { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
    { id: 'slack_notify', label: 'Slack Notification', params: ['channel', 'message'] },
    { id: 'create_jira', label: 'Create Jira Ticket', params: ['project', 'summary'] },
];

export const getAutomations = async (): Promise<AutomationAction[]> => {
    // Simulate network delay
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(MOCK_AUTOMATIONS);
        }, 500);
    });
};

interface SimulationStep {
    step: number;
    nodeId: string;
    node: string;
    type: string;
    status: 'completed' | 'pending' | 'failed';
    output: string;
    details?: Record<string, any>;
}

interface SimulationResult {
    success: boolean;
    steps: SimulationStep[];
    totalDuration: string;
}

// Helper to generate output description based on node type and data
const generateNodeOutput = (node: Node): { output: string; details: Record<string, any> } => {
    const data = node.data;
    const type = node.type;

    switch (type) {
        case 'start':
            return {
                output: `Workflow "${data.label}" initiated`,
                details: { trigger: 'Manual', timestamp: new Date().toISOString() }
            };

        case 'task':
            const taskDetails: Record<string, any> = {};
            if (data.assignee) taskDetails.assignee = data.assignee;
            if (data.dueDate) taskDetails.dueDate = data.dueDate;
            if (data.description) taskDetails.description = data.description;

            return {
                output: data.description
                    ? `Task completed: ${data.description.substring(0, 50)}${data.description.length > 50 ? '...' : ''}`
                    : `Task "${data.label}" completed`,
                details: Object.keys(taskDetails).length > 0 ? taskDetails : { status: 'Completed successfully' }
            };

        case 'approval':
            const approvalDetails: Record<string, any> = {
                approvedBy: data.approverRole || 'Manager',
                decision: 'Approved'
            };
            if (data.autoApproveThreshold) {
                approvalDetails.autoApproveThreshold = `$${data.autoApproveThreshold}`;
            }

            return {
                output: `Approved by ${data.approverRole || 'Manager'}`,
                details: approvalDetails
            };

        case 'automated':
            const action = MOCK_AUTOMATIONS.find(a => a.id === data.actionId);
            const actionParams = data.actionParams || {};
            const paramSummary = Object.entries(actionParams)
                .filter(([_, v]) => v)
                .map(([k, v]) => `${k}: ${v}`)
                .join(', ');

            return {
                output: action
                    ? `${action.label} executed${paramSummary ? ` (${paramSummary})` : ''}`
                    : 'Automated action executed',
                details: {
                    action: action?.label || data.actionId || 'Unknown',
                    parameters: Object.keys(actionParams).length > 0 ? actionParams : 'None configured'
                }
            };

        case 'end':
            return {
                output: data.endMessage || 'Workflow completed successfully',
                details: {
                    showSummary: data.isSummary || false,
                    completedAt: new Date().toISOString()
                }
            };

        default:
            return {
                output: `${data.label} processed`,
                details: {}
            };
    }
};

// Traverse the workflow graph from start to end
const traverseWorkflow = (nodes: Node[], edges: Edge[]): Node[] => {
    const nodeMap = new Map(nodes.map(n => [n.id, n]));
    const edgeMap = new Map<string, string[]>();

    // Build adjacency list
    edges.forEach(edge => {
        if (!edgeMap.has(edge.source)) {
            edgeMap.set(edge.source, []);
        }
        edgeMap.get(edge.source)!.push(edge.target);
    });

    // Find start node
    const startNode = nodes.find(n => n.type === 'start');
    if (!startNode) return [];

    // BFS traversal
    const visited = new Set<string>();
    const result: Node[] = [];
    const queue: string[] = [startNode.id];

    while (queue.length > 0) {
        const currentId = queue.shift()!;
        if (visited.has(currentId)) continue;

        visited.add(currentId);
        const currentNode = nodeMap.get(currentId);
        if (currentNode) {
            result.push(currentNode);
        }

        // Add connected nodes
        const nextNodes = edgeMap.get(currentId) || [];
        nextNodes.forEach(nextId => {
            if (!visited.has(nextId)) {
                queue.push(nextId);
            }
        });
    }

    return result;
};

export const simulateWorkflow = async (workflow: { nodes: Node[], edges: Edge[] }): Promise<SimulationResult> => {
    return new Promise((resolve) => {
        // Simulate processing time
        setTimeout(() => {
            const { nodes, edges } = workflow;

            // Traverse the workflow in order
            const orderedNodes = traverseWorkflow(nodes, edges);

            // Generate simulation steps
            const steps: SimulationStep[] = orderedNodes.map((node, index) => {
                const { output, details } = generateNodeOutput(node);
                return {
                    step: index + 1,
                    nodeId: node.id,
                    node: node.data.label,
                    type: node.type || 'unknown',
                    status: 'completed',
                    output,
                    details
                };
            });

            resolve({
                success: true,
                steps,
                totalDuration: `${(steps.length * 0.5).toFixed(1)}s`
            });
        }, 1500);
    });
};

