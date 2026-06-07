// toolbar.js
// Renders the node palette — all draggable node chips.
//
// Iterates NODE_CONFIGS grouped by NODE_CATEGORIES.
// Adding a new node to the registry automatically adds it here.

import { DraggableNode } from './draggableNode';
import { NODE_CONFIGS, NODE_CATEGORIES } from './nodes';

export const PipelineToolbar = () => (
  <div style={{ padding: '12px 16px', background: '#13161E', borderBottom: '1px solid #2D3348' }}>
    {NODE_CATEGORIES.map((category) => {
      const categoryNodes = Object.entries(NODE_CONFIGS).filter(
        ([, cfg]) => cfg.category === category
      );
      if (!categoryNodes.length) return null;

      return (
        <div key={category} style={{ marginBottom: 8 }}>
          <span style={{
            display: 'block',
            fontSize: 10,
            fontWeight: 600,
            color: '#64748B',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginBottom: 8,
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            {category}
          </span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {categoryNodes.map(([type, cfg]) => (
              <DraggableNode key={type} type={type} config={cfg} />
            ))}
          </div>
        </div>
      );
    })}
  </div>
);
