import { ReactFlowProvider } from 'reactflow';
import WorkflowCanvas from './components/canvas/WorkflowCanvas';
import NodePalette from './components/panels/NodePalette';
import PropertiesPanel from './components/panels/PropertiesPanel';
import SimulationPanel from './components/panels/SimulationPanel';

function App() {
  return (
    <ReactFlowProvider>
      <div className="flex h-screen w-screen flex-col bg-background text-foreground overflow-hidden">
        {/* Header */}
        <header className="flex h-14 items-center border-b px-6 bg-card z-10">
          <h1 className="text-lg font-semibold">HR Workflow Designer</h1>
          <div className="ml-auto flex items-center gap-2">
            <SimulationPanel />
          </div>
        </header>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - Node Palette */}
          <aside className="w-64 border-r bg-muted/30 p-4 overflow-y-auto">
            <h2 className="mb-4 text-sm font-medium text-muted-foreground">Components</h2>
            <NodePalette />
          </aside>

          {/* Canvas Area */}
          <main className="flex-1 relative bg-slate-50 dark:bg-slate-950">
            <WorkflowCanvas />
          </main>

          {/* Right Sidebar - Properties */}
          <aside className="w-80 border-l bg-card p-4 overflow-y-auto">
            <h2 className="mb-4 text-sm font-medium text-muted-foreground">Properties</h2>
            <PropertiesPanel />
          </aside>
        </div>
      </div>
    </ReactFlowProvider>
  );
}

export default App;
