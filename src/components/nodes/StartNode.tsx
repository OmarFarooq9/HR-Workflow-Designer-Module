import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CirclePlay } from 'lucide-react';
import { StartNodeData } from '../../types/workflow';
import NodeActions from './NodeActions';

const StartNode = memo(({ id, data, selected }: NodeProps<StartNodeData>) => {
    return (
        <div className={`min-w-[150px] rounded-lg border bg-card p-3 shadow-sm transition-all ${selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}>
            <NodeActions id={id} selected={selected} />
            <div className="flex items-center gap-2 border-b border-border pb-2 mb-2">
                <div className="rounded-full bg-green-100 p-1 dark:bg-green-900/30">
                    <CirclePlay className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <span className="text-sm font-semibold">{data.label}</span>
            </div>
            <div className="text-xs text-muted-foreground">
                Workflow Entry Point
            </div>
            <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
        </div>
    );
});

export default StartNode;
