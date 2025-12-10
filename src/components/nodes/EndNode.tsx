import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CircleStop } from 'lucide-react';
import { EndNodeData } from '../../types/workflow';
import NodeActions from './NodeActions';

const EndNode = memo(({ id, data, selected }: NodeProps<EndNodeData>) => {
    return (
        <div className={`min-w-[150px] rounded-lg border bg-card p-3 shadow-sm transition-all ${selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}>
            <NodeActions id={id} selected={selected} />
            <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />

            <div className="flex items-center gap-2 border-b border-border pb-2 mb-2">
                <div className="rounded-full bg-red-100 p-1 dark:bg-red-900/30">
                    <CircleStop className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <span className="text-sm font-semibold">{data.label}</span>
            </div>

            <div className="text-xs text-muted-foreground">
                {data.endMessage || 'Workflow Completed'}
            </div>
        </div>
    );
});

export default EndNode;
