# HR Workflow Designer

A functional prototype of a visual workflow designer module for HR processes. Allows HR admins to create, configure, and test internal workflows using a drag-and-drop interface.



## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Design Decisions](#design-decisions)
- [What's Completed](#whats-completed)
- [Future Improvements](#future-improvements)

---

## Features

### Visual Workflow Canvas
- **Drag-and-drop** nodes from the palette onto the canvas
- **Connect nodes** by dragging from source handles to target handles
- **Delete nodes/edges** via toolbar buttons or keyboard shortcuts (Delete/Backspace)
- **Pan and zoom** the canvas with mouse/trackpad
- **Mini-map** for navigation on large workflows

### Node Types
| Node Type | Purpose | Configurable Fields |
|-----------|---------|---------------------|
| **Start** | Entry point of workflow | Label |
| **Task** | Human task assignment | Label, Description, Assignee, Due Date |
| **Approval** | Approval gate with roles | Label, Approver Role, Auto-approve Threshold |
| **Automated** | System actions (API calls) | Label, Action Type, Dynamic Parameters |
| **End** | Workflow termination | Label, End Message, Show Summary |

### Workflow Simulation
- **Validation**: Simulate button only activates when workflow is valid (has Start, End, and all nodes connected)
- **Real execution**: Traverses the actual workflow graph from Start → End
- **Dynamic output**: Shows configured values for each node in the simulation results
- **Visual feedback**: Step-by-step timeline with color-coded node types

---

## Architecture

```
hr-workflow-designer/
├── src/
│   ├── api/
│   │   └── mockApi.ts          # Mock API for automations & workflow simulation
│   │
│   ├── components/
│   │   ├── canvas/
│   │   │   └── WorkflowCanvas.tsx   # Main React Flow canvas with custom edges
│   │   │
│   │   ├── nodes/
│   │   │   ├── StartNode.tsx        # Start node component
│   │   │   ├── TaskNode.tsx         # Task node component
│   │   │   ├── ApprovalNode.tsx     # Approval node component
│   │   │   ├── AutomatedNode.tsx    # Automated action node component
│   │   │   ├── EndNode.tsx          # End node component
│   │   │   └── NodeActions.tsx      # Shared node toolbar (delete button)
│   │   │
│   │   └── panels/
│   │       ├── NodePalette.tsx      # Draggable node types sidebar
│   │       ├── PropertiesPanel.tsx  # Node configuration sidebar
│   │       ├── SimulationPanel.tsx  # Simulate button & results modal
│   │       └── forms/
│   │           ├── StartNodeForm.tsx
│   │           ├── TaskNodeForm.tsx
│   │           ├── ApprovalNodeForm.tsx
│   │           ├── AutomatedNodeForm.tsx
│   │           └── EndNodeForm.tsx
│   │
│   ├── types/
│   │   └── workflow.ts          # TypeScript interfaces for nodes & workflow
│   │
│   ├── App.tsx                  # Main layout with header & 3-column structure
│   ├── main.tsx                 # React entry point
│   └── index.css                # Global styles & Tailwind config
│
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

### Component Hierarchy

```
App
├── ReactFlowProvider
│   ├── Header
│   │   └── SimulationPanel (Simulate button + Results modal)
│   ├── Left Sidebar
│   │   └── NodePalette (Draggable node types)
│   ├── Main Canvas
│   │   └── WorkflowCanvas
│   │       ├── ReactFlow
│   │       ├── Custom Nodes (Start, Task, Approval, Automated, End)
│   │       └── Custom Edges (DeletableEdge with X button)
│   └── Right Sidebar
│       └── PropertiesPanel
│           └── Form Components (based on selected node type)
```

---

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/BharatiPatra/WorkFlow.git
cd WorkFlow

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at http://localhost:5173 |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## Design Decisions

### 1. State Management
- **React Flow's internal state** manages nodes and edges via `useNodesState` and `useEdgesState`
- **No external state library** (Redux, Zustand) needed - React Flow handles graph state efficiently
- **Form state** managed by `react-hook-form` with real-time sync to node data via `watch()`

### 2. Component Architecture
- **Separation of concerns**: Each node type has its own display component AND form component
- **Shared behaviors**: `NodeActions` component provides reusable delete functionality
- **Custom edges**: `DeletableEdge` component adds delete button to connections

### 3. Validation Strategy
- **Reactive validation** using `useStore` hook to watch nodes/edges changes
- **Pre-flight checks**: Simulate button disabled until workflow is valid
- **Graph traversal**: BFS algorithm ensures proper flow from Start → End

### 4. Simulation Approach
- **Graph-aware**: Simulation traverses actual edges, not just node order
- **Node-specific output**: Each node type generates contextual simulation output
- **Configurable details**: Shows actual user-input values in results

### 5. Styling Choices
- **Tailwind CSS**: Rapid development with consistent design tokens
- **Dark mode ready**: CSS variables support light/dark themes
- **Visual hierarchy**: Color-coded node types (green=start, blue=task, orange=approval, purple=automated, red=end)

### 6. TypeScript Usage
- **Strict typing**: All node data types defined in `types/workflow.ts`
- **Type-safe forms**: Form data matches node interfaces
- **Generic components**: React Flow generics ensure type safety

---

## What's Completed

### Core Features ✅
- [x] Drag-and-drop workflow canvas with React Flow
- [x] 5 custom node types (Start, Task, Approval, Automated, End)
- [x] Node configuration forms with dynamic fields
- [x] Automated node with dynamic parameter inputs (not fixed display)
- [x] Edge creation by dragging between handles
- [x] Edge deletion via X button or keyboard
- [x] Node deletion via toolbar button or keyboard

### Simulation ✅
- [x] Workflow validation (requires Start, End, all nodes connected)
- [x] Disabled simulate button with tooltip explaining why
- [x] Real graph traversal (BFS from Start → End)
- [x] Dynamic simulation results based on actual node configurations
- [x] Color-coded step timeline in results modal
- [x] Detailed output showing configured values

### UI/UX ✅
- [x] 3-column layout (palette | canvas | properties)
- [x] Real-time property updates when editing nodes
- [x] Visual feedback for selected nodes/edges
- [x] Arrow markers on edges showing flow direction
- [x] Mini-map for large workflow navigation
- [x] Canvas controls (zoom, fit view)

### Mock API ✅
- [x] `GET /automations` - Returns available automation actions
- [x] `POST /simulate` - Simulates workflow execution with realistic output

---

## Future Improvements

### With More Time

#### High Priority
- [ ] **Undo/Redo**: Implement using React Flow's built-in history or custom state snapshots
- [ ] **Workflow Persistence**: Save/load workflows to localStorage or backend API
- [ ] **Export/Import**: JSON export of workflow definitions
- [ ] **Conditional Branching**: Add decision nodes with multiple outgoing paths based on conditions

#### Medium Priority
- [ ] **Visual Validation**: Red borders on nodes with missing required fields
- [ ] **Copy/Paste Nodes**: Duplicate nodes with Ctrl+C/Ctrl+V
- [ ] **Node Templates**: Pre-configured node templates for common HR tasks
- [ ] **Workflow Templates**: Full workflow templates (e.g., "Employee Onboarding", "Leave Approval")

#### Nice to Have
- [ ] **Real-time Collaboration**: Multiple users editing same workflow
- [ ] **Execution History**: Track past simulation/execution runs
- [ ] **Custom Node Builder**: UI for creating new node types without code
- [ ] **Integration with Real APIs**: Replace mock API with actual HR system integrations
- [ ] **Mobile Responsive**: Touch-friendly canvas for tablet use
- [ ] **Keyboard Shortcuts**: Full keyboard navigation and shortcuts panel
- [ ] **Comments/Notes**: Add annotations to workflows for documentation

#### Production Readiness
- [ ] **Unit Tests**: Jest/Vitest tests for components and simulation logic
- [ ] **E2E Tests**: Playwright/Cypress tests for critical user flows
- [ ] **Error Boundaries**: Graceful error handling throughout the app
- [ ] **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- [ ] **Performance**: Virtualization for large workflows (100+ nodes)

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| [React 18](https://react.dev) | UI framework |
| [TypeScript](https://www.typescriptlang.org) | Type safety |
| [React Flow](https://reactflow.dev) | Graph/canvas library |
| [Tailwind CSS](https://tailwindcss.com) | Utility-first styling |
| [React Hook Form](https://react-hook-form.com) | Form state management |
| [Lucide React](https://lucide.dev) | Icon library |
| [Vite](https://vitejs.dev) | Build tool & dev server |
| [UUID](https://github.com/uuidjs/uuid) | Unique ID generation |


