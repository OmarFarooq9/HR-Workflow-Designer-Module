import { useState, useCallback } from 'react';
import { useOnSelectionChange, useReactFlow, Node } from 'reactflow';
import StartNodeForm from './forms/StartNodeForm';
import TaskNodeForm from './forms/TaskNodeForm';
import ApprovalNodeForm from './forms/ApprovalNodeForm';
import AutomatedNodeForm from './forms/AutomatedNodeForm';
import EndNodeForm from './forms/EndNodeForm';
import { WorkflowNodeData } from '../../types/workflow';

const PropertiesPanel = () => {
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const { setNodes } = useReactFlow();

    useOnSelectionChange({
        onChange: ({ nodes }) => {
            setSelectedNode(nodes[0] || null);
        },
    });

    const onNodeDataChange = useCallback((newData: Partial<WorkflowNodeData>) => {
        if (!selectedNode) return;

        setNodes((nds) =>
            nds.map((node) => {
                if (node.id === selectedNode.id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            ...newData,
                        },
                    };
                }
                return node;
            })
        );
    }, [selectedNode, setNodes]);

    if (!selectedNode) {
        return (
            <div className="flex h-full flex-col items-center justify-center text-center text-muted-foreground">
                <p className="text-sm">Select a node to edit its properties.</p>
            </div>
        );
    }

    const renderForm = () => {
        switch (selectedNode.type) {
            case 'start':
                return <StartNodeForm key={selectedNode.id} data={selectedNode.data} onChange={onNodeDataChange} />;
            case 'task':
                return <TaskNodeForm key={selectedNode.id} data={selectedNode.data} onChange={onNodeDataChange} />;
            case 'approval':
                return <ApprovalNodeForm key={selectedNode.id} data={selectedNode.data} onChange={onNodeDataChange} />;
            case 'automated':
                return <AutomatedNodeForm key={selectedNode.id} data={selectedNode.data} onChange={onNodeDataChange} />;
            case 'end':
                return <EndNodeForm key={selectedNode.id} data={selectedNode.data} onChange={onNodeDataChange} />;
            default:
                return <div>Unknown node type</div>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="border-b pb-4">
                <h3 className="font-semibold text-lg">{selectedNode.data.label}</h3>
                <p className="text-xs text-muted-foreground">ID: {selectedNode.id}</p>
            </div>
            {renderForm()}
        </div>
    );
};

export default PropertiesPanel;
