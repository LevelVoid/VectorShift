// ui.js
// Displays the drag-and-drop pipeline canvas.
//
// nodeTypes is derived at MODULE LEVEL from NODE_CONFIGS so ReactFlow
// always sees stable component references — no "new nodeTypes object"
// warning and no unnecessary node re-renders.

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { NODE_CONFIGS } from './nodes';
import { BaseNode } from './nodes/BaseNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

// ─── Stable nodeTypes ────────────────────────────────────────────────────────
// Built once at module load. Each entry binds a config to BaseNode via closure.
// Being at module level (not inside a component or hook) guarantees the object
// reference never changes across renders — this is what ReactFlow requires.
const nodeTypes = Object.fromEntries(
  Object.entries(NODE_CONFIGS).map(([type, config]) => {
    const BoundNode = (props) => <BaseNode {...props} nodeConfig={config} />;
    BoundNode.displayName = config.title;
    return [type, BoundNode];
  })
);

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
  const reactFlowWrapper = useRef(null);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const { nodes, edges, getNodeID, addNode, onNodesChange, onEdgesChange, onConnect } =
    useStore(selector, shallow);

  /**
   * Initialise a new node's data with field defaults from its config.
   * Without this, fields would show config defaults visually but the store
   * would have no record of them until the user interacts.
   */
  const getInitNodeData = (nodeID, type) => {
    const config = NODE_CONFIGS[type];
    const fieldDefaults = {};
    (config?.fields || []).forEach((field) => {
      if (field.default !== undefined) {
        fieldDefaults[field.name] = field.default;
      }
    });
    return { id: nodeID, nodeType: type, ...fieldDefaults };
  };

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
      if (!event?.dataTransfer?.getData('application/reactflow')) return;

      const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
      const type = appData?.nodeType;
      if (!type) return;

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const nodeID = getNodeID(type);
      addNode({ id: nodeID, type, position, data: getInitNodeData(nodeID, type) });
    },
    [reactFlowInstance]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={reactFlowWrapper} style={{ width: '100vw', height: '70vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onInit={setReactFlowInstance}
        nodeTypes={nodeTypes}
        proOptions={proOptions}
        snapGrid={[gridSize, gridSize]}
        connectionLineType="smoothstep"
      >
        <Background color="#2D3348" gap={gridSize} />
        <Controls />
        <MiniMap
          nodeColor={(node) => NODE_CONFIGS[node.type]?.color ?? '#555'}
          maskColor="rgba(13,15,20,0.7)"
        />
      </ReactFlow>
    </div>
  );
};
