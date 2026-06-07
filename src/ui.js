import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';
import { NODE_CONFIGS } from './nodes';
import { BaseNode } from './nodes/BaseNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };

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
    [reactFlowInstance, addNode, getNodeID]
  );

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  return (
    <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%' }}>
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
        connectionLineType="straight"
      >
        <Background color="#D1D5DB" gap={gridSize} size={1} />
        <Controls />
        <MiniMap
          nodeColor={(node) => NODE_CONFIGS[node.type]?.color || '#E5E7EB'}
          nodeBorderRadius={4}
          maskColor="rgba(243, 244, 246, 0.7)"
          style={{ border: '1px solid #E5E7EB', borderRadius: '4px', backgroundColor: '#FFFFFF', bottom: 80, right: 16 }}
        />
      </ReactFlow>
    </div>
  );
};
