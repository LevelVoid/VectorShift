import { DraggableNode } from './draggableNode';
import { NODE_CONFIGS, NODE_CATEGORIES } from './nodes';

export const PipelineToolbar = () => (
  <div style={{ 
    width: '240px', 
    backgroundColor: 'var(--vs-sidebar-bg)', 
    borderRight: '1px solid var(--vs-border)',
    display: 'flex',
    flexDirection: 'column',
    padding: '24px 16px'
  }}>
    <div style={{ marginBottom: '24px' }}>
      <div style={{ 
        fontSize: '11px', 
        fontWeight: 600, 
        color: 'var(--vs-muted)', 
        letterSpacing: '0.5px', 
        marginBottom: '4px' 
      }}>
        NODE LIBRARY
      </div>
      <div style={{ fontSize: '13px', color: 'var(--vs-muted)', marginBottom: '20px' }}>
        Drag to canvas
      </div>
      <button style={{
        width: '100%',
        backgroundColor: '#000000',
        color: '#FFFFFF',
        border: 'none',
        padding: '10px',
        borderRadius: '4px',
        fontSize: '14px',
        fontWeight: 500,
        cursor: 'pointer'
      }}>
        New Workflow
      </button>
    </div>

    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      {NODE_CATEGORIES.map((category) => {
        const categoryNodes = Object.entries(NODE_CONFIGS).filter(
          ([, cfg]) => cfg.category === category
        );
        if (!categoryNodes.length) return null;

        return (
          <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {categoryNodes.map(([type, cfg]) => (
              <DraggableNode key={type} type={type} config={cfg} />
            ))}
          </div>
        );
      })}
    </div>
  </div>
);
