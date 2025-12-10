import { useState, useMemo } from 'react';
import { useReactFlow, useStore } from 'reactflow';
import { Play, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { simulateWorkflow } from '../../api/mockApi';

const SimulationPanel = () => {
    const { getNodes, getEdges } = useReactFlow();
    const [isSimulating, setIsSimulating] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    // Subscribe to nodes and edges changes for reactive validation
    const nodes = useStore((state) => state.getNodes());
    const edges = useStore((state) => state.edges);

    // Validate workflow: must have end node and all nodes must be connected
    const validationResult = useMemo(() => {
        if (nodes.length === 0) {
            return { isValid: false, message: 'Add nodes to the canvas' };
        }

        const hasEndNode = nodes.some((n) => n.type === 'end');
        if (!hasEndNode) {
            return { isValid: false, message: 'Add an End node to the workflow' };
        }

        const hasStartNode = nodes.some((n) => n.type === 'start');
        if (!hasStartNode) {
            return { isValid: false, message: 'Add a Start node to the workflow' };
        }

        // Check if all nodes are connected (each non-start node should have an incoming edge,
        // each non-end node should have an outgoing edge)
        const nodesWithIncoming = new Set(edges.map((e) => e.target));
        const nodesWithOutgoing = new Set(edges.map((e) => e.source));

        for (const node of nodes) {
            // Start nodes don't need incoming edges
            if (node.type !== 'start' && !nodesWithIncoming.has(node.id)) {
                return { isValid: false, message: `"${node.data.label}" has no incoming connection` };
            }
            // End nodes don't need outgoing edges
            if (node.type !== 'end' && !nodesWithOutgoing.has(node.id)) {
                return { isValid: false, message: `"${node.data.label}" has no outgoing connection` };
            }
        }

        return { isValid: true, message: 'Ready to simulate' };
    }, [nodes, edges]);

    const handleSimulate = async () => {
        const currentNodes = getNodes();
        const currentEdges = getEdges();

        // Basic Validation (keep as fallback)
        const startNode = currentNodes.find((n) => n.type === 'start');
        const endNode = currentNodes.find((n) => n.type === 'end');

        if (!startNode) {
            setError('Workflow must have a Start Node.');
            setShowResults(true);
            return;
        }
        if (!endNode) {
            setError('Workflow must have an End Node.');
            setShowResults(true);
            return;
        }

        setError(null);
        setIsSimulating(true);
        setShowResults(true);

        try {
            const workflow = { nodes: currentNodes, edges: currentEdges };
            const result = await simulateWorkflow(workflow);
            setResults(result);
        } catch (err) {
            setError('Simulation failed.');
        } finally {
            setIsSimulating(false);
        }
    };

    const isDisabled = isSimulating || !validationResult.isValid;

    return (
        <>
            <div className="relative group">
                <button
                    onClick={handleSimulate}
                    disabled={isDisabled}
                    className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSimulating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
                    Simulate
                </button>
                {!validationResult.isValid && (
                    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 bg-slate-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                        {validationResult.message}
                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45" />
                    </div>
                )}
            </div>

            {showResults && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="w-[500px] rounded-lg bg-card p-6 shadow-lg border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-semibold">Simulation Results</h3>
                            <button
                                onClick={() => setShowResults(false)}
                                className="text-muted-foreground hover:text-foreground"
                            >
                                <XCircle className="h-5 w-5" />
                            </button>
                        </div>

                        {error ? (
                            <div className="rounded-md bg-destructive/10 p-4 text-destructive flex items-center gap-2">
                                <XCircle className="h-5 w-5" />
                                {error}
                            </div>
                        ) : isSimulating ? (
                            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin mb-2" />
                                <p>Running simulation...</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <CheckCircle2 className="h-5 w-5" />
                                        <span className="font-medium">Workflow Completed Successfully</span>
                                    </div>
                                    {results?.totalDuration && (
                                        <span className="text-xs text-muted-foreground">
                                            Duration: {results.totalDuration}
                                        </span>
                                    )}
                                </div>

                                <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
                                    {results?.steps?.map((step: any, index: number) => (
                                        <div key={index} className="relative flex gap-3">
                                            {/* Step number indicator */}
                                            <div className="flex flex-col items-center">
                                                <div className="flex items-center justify-center w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold shadow">
                                                    {step.step}
                                                </div>
                                                {index < results.steps.length - 1 && (
                                                    <div className="w-0.5 flex-1 bg-slate-200 mt-1" />
                                                )}
                                            </div>

                                            {/* Step content */}
                                            <div className="flex-1 bg-white dark:bg-slate-800 p-3 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm mb-2">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-semibold text-slate-900 dark:text-white">{step.node}</span>
                                                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium uppercase ${step.type === 'start' ? 'bg-green-100 text-green-700' :
                                                                step.type === 'end' ? 'bg-red-100 text-red-700' :
                                                                    step.type === 'task' ? 'bg-blue-100 text-blue-700' :
                                                                        step.type === 'approval' ? 'bg-orange-100 text-orange-700' :
                                                                            step.type === 'automated' ? 'bg-purple-100 text-purple-700' :
                                                                                'bg-slate-100 text-slate-700'
                                                            }`}>
                                                            {step.type}
                                                        </span>
                                                    </div>
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                                </div>

                                                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{step.output}</p>

                                                {step.details && Object.keys(step.details).length > 0 && (
                                                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-700">
                                                        <p className="text-[10px] font-medium text-slate-400 uppercase mb-1">Details</p>
                                                        <div className="grid grid-cols-2 gap-1">
                                                            {Object.entries(step.details).map(([key, value]) => (
                                                                <div key={key} className="text-xs">
                                                                    <span className="text-slate-400">{key}: </span>
                                                                    <span className="text-slate-600 dark:text-slate-300">
                                                                        {typeof value === 'object'
                                                                            ? JSON.stringify(value)
                                                                            : String(value)}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="mt-6 flex justify-end">
                            <button
                                onClick={() => setShowResults(false)}
                                className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default SimulationPanel;

