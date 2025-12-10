import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { CheckSquare, User } from 'lucide-react';
import { TaskNodeData } from '../../types/workflow';
import NodeActions from './NodeActions';

const TaskNode = memo(({ id, data, selected }: NodeProps<TaskNodeData>) => {
    return (
        <div className={`min-w-[200px] rounded-lg border bg-card p-3 shadow-sm transition-all ${selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}>
            <NodeActions id={id} selected={selected} />
            <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />

            <div className="flex items-center gap-2 border-b border-border pb-2 mb-2">
                <div className="rounded-full bg-blue-100 p-1 dark:bg-blue-900/30">
                    <CheckSquare className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-sm font-semibold">{data.label}</span>
            </div>

            <div className="space-y-1">
                <p className="text-xs text-muted-foreground line-clamp-2">
                    {data.description || 'No description'}
                </p>
                {data.assignee && (
                    <div className="flex items-center gap-1 text-xs text-primary bg-primary/10 w-fit px-2 py-0.5 rounded-full">
                        <User className="h-3 w-3" />
                        <span>{data.assignee}</span>
                    </div>
                )}
            </div>

            <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
        </div>
    );
});

export default TaskNode;
