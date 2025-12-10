import React, { useCallback, useRef } from 'react';
import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    ReactFlowInstance,
    Node,
    EdgeProps,
    getBezierPath,
    useReactFlow,
    MarkerType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { v4 as uuidv4 } from 'uuid';
import { X } from 'lucide-react';

import StartNode from '../nodes/StartNode';
import TaskNode from '../nodes/TaskNode';
import ApprovalNode from '../nodes/ApprovalNode';
import AutomatedNode from '../nodes/AutomatedNode';
import EndNode from '../nodes/EndNode';
import { NodeType } from '../../types/workflow';

const nodeTypes = {
    start: StartNode,
    task: TaskNode,
    approval: ApprovalNode,
    automated: AutomatedNode,
    end: EndNode,
};

// Custom edge with delete button
const DeletableEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    selected,
}: EdgeProps) => {
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });

    const onEdgeDelete = (event: React.MouseEvent) => {
        event.stopPropagation();
        setEdges((edges) => edges.filter((edge) => edge.id !== id));
    };

    return (
        <>
            <path
                id={id}
                style={style}
                className={`react-flow__edge-path ${selected ? 'stroke-primary' : 'stroke-slate-400'}`}
                d={edgePath}
                strokeWidth={selected ? 3 : 2}
                markerEnd={markerEnd}
            />
            {/* Invisible wider path for easier selection */}
            <path
                d={edgePath}
                fill="none"
                strokeWidth={20}
                stroke="transparent"
                className="react-flow__edge-interaction"
            />
            {/* Delete button - always visible on selected, hover shows via CSS */}
            <foreignObject
                width={20}
                height={20}
                x={labelX - 10}
                y={labelY - 10}
                className={`overflow-visible transition-opacity ${selected ? 'opacity-100' : 'opacity-0 hover:opacity-100'}`}
                requiredExtensions="http://www.w3.org/1999/xhtml"
            >
                <button
                    onClick={onEdgeDelete}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-md hover:bg-red-600 transition-colors cursor-pointer"
                    title="Delete connection"
                >
                    <X className="h-3 w-3" />
                </button>
            </foreignObject>
        </>
    );
};

const edgeTypes = {
    deletable: DeletableEdge,
};

const initialNodes: Node[] = [
    {
        id: 'start-1',
        type: 'start',
        position: { x: 250, y: 50 },
        data: { label: 'Start Workflow', type: 'start' },
    },
];

const WorkflowCanvas = () => {
    const reactFlowWrapper = useRef<HTMLDivElement>(null);
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);
    const [reactFlowInstance, setReactFlowInstance] = React.useState<ReactFlowInstance | null>(null);

    const onConnect = useCallback(
        (params: Connection | Edge) => {
            // Add edge with deletable type and arrow marker
            const edge = {
                ...params,
                type: 'deletable',
                markerEnd: {
                    type: MarkerType.ArrowClosed,
                    color: '#94a3b8',
                },
            };
            setEdges((eds) => addEdge(edge, eds));
        },
        [setEdges]
    );

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow/type') as NodeType;
            const label = event.dataTransfer.getData('application/reactflow/label');

            if (typeof type === 'undefined' || !type) {
                return;
            }

            const position = reactFlowInstance?.screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            if (!position) return;

            const newNode: Node = {
                id: uuidv4(),
                type,
                position,
                data: { label: label || `${type} node`, type },
            };

            setNodes((nds) => nds.concat(newNode));
        },
        [reactFlowInstance, setNodes]
    );

    return (
        <div className="h-full w-full" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                defaultEdgeOptions={{
                    type: 'deletable',
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: '#94a3b8',
                    },
                }}
                deleteKeyCode={['Backspace', 'Delete']}
                fitView
            >
                <Background gap={12} size={1} />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
};

export default WorkflowCanvas;

