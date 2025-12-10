import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FileCheck, ShieldCheck } from 'lucide-react';
import { ApprovalNodeData } from '../../types/workflow';
import NodeActions from './NodeActions';

const ApprovalNode = memo(({ id, data, selected }: NodeProps<ApprovalNodeData>) => {
    return (
        <div className={`min-w-[200px] rounded-lg border bg-card p-3 shadow-sm transition-all ${selected ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}>
            <NodeActions id={id} selected={selected} />
            <Handle type="target" position={Position.Top} className="!bg-muted-foreground" />

            <div className="flex items-center gap-2 border-b border-border pb-2 mb-2">
                <div className="rounded-full bg-orange-100 p-1 dark:bg-orange-900/30">
                    <FileCheck className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-sm font-semibold">{data.label}</span>
            </div>

            <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs font-medium">
                    <ShieldCheck className="h-3 w-3 text-muted-foreground" />
                    <span>Role: {data.approverRole || 'Unassigned'}</span>
                </div>
                {data.autoApproveThreshold && (
                    <p className="text-xs text-muted-foreground">
                        Auto-approve &lt; {data.autoApproveThreshold}
                    </p>
                )}
            </div>

            <Handle type="source" position={Position.Bottom} className="!bg-muted-foreground" />
        </div>
    );
});

export default ApprovalNode;
