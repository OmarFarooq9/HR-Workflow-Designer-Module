import { NodeToolbar, useReactFlow, Position } from 'reactflow';
import { Trash2 } from 'lucide-react';

interface NodeActionsProps {
    id: string;
    selected?: boolean;
}

const NodeActions = ({ id, selected }: NodeActionsProps) => {
    const { deleteElements } = useReactFlow();

    const handleDelete = () => {
        deleteElements({ nodes: [{ id }] });
    };

    return (
        <NodeToolbar isVisible={selected} position={Position.Top} className="flex gap-2">
            <button
                onClick={handleDelete}
                className="rounded-md bg-destructive p-1.5 text-destructive-foreground hover:bg-destructive/90 shadow-sm border border-border bg-white dark:bg-slate-950"
                title="Delete Node"
            >
                <Trash2 className="h-4 w-4 text-red-500" />
            </button>
        </NodeToolbar>
    );
};

export default NodeActions;
