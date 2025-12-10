import React from 'react';
import { NodeType } from '../../types/workflow';
import { CirclePlay, CheckSquare, FileCheck, Bot, CircleStop } from 'lucide-react';

const NodePalette = () => {
    const onDragStart = (event: React.DragEvent, nodeType: NodeType, label: string) => {
        event.dataTransfer.setData('application/reactflow/type', nodeType);
        event.dataTransfer.setData('application/reactflow/label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    const nodes = [
        { type: 'start', label: 'Start Node', icon: CirclePlay, color: 'text-green-500' },
        { type: 'task', label: 'Task Node', icon: CheckSquare, color: 'text-blue-500' },
        { type: 'approval', label: 'Approval Node', icon: FileCheck, color: 'text-orange-500' },
        { type: 'automated', label: 'Automated Step', icon: Bot, color: 'text-purple-500' },
        { type: 'end', label: 'End Node', icon: CircleStop, color: 'text-red-500' },
    ] as const;

    return (
        <div className="flex flex-col gap-3">
            {nodes.map((node) => (
                <div
                    key={node.type}
                    className="flex cursor-grab items-center gap-3 rounded-md border bg-card p-3 shadow-sm transition-all hover:shadow-md hover:border-primary/50"
                    draggable
                    onDragStart={(event) => onDragStart(event, node.type, node.label)}
                >
                    <node.icon className={`h-5 w-5 ${node.color}`} />
                    <span className="text-sm font-medium">{node.label}</span>
                </div>
            ))}
        </div>
    );
};

export default NodePalette;
