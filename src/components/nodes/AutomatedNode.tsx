import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Bot, Zap } from 'lucide-react';
import { AutomatedNodeData } from '../../types/workflow';
import NodeActions from './NodeActions';

const AutomatedNode = memo(({ id, data, selected }: NodeProps<AutomatedNodeData>) => {
    return (
        <div className={`min-w-[200px] rounded-lg border bg-card p-3 shadow-sm transition-all ${selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}>
            <NodeActions id={id} selected={selected} />
            <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />

            <div className="flex items-center gap-2 border-b border-border pb-2 mb-2">
                <div className="rounded-full bg-purple-100 p-1 dark:bg-purple-900/30">
                    <Bot className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-sm font-semibold">{data.label}</span>
            </div>

            <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Zap className="h-3 w-3" />
                    <span>{data.actionId ? `Action: ${data.actionId}` : 'No Action Selected'}</span>
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
        </div>
    );
});

export default AutomatedNode;
