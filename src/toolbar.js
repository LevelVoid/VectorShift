import { useState } from 'react';
import { DraggableNode } from './draggableNode';
import { NODE_CONFIGS, NODE_CATEGORIES } from './nodes';
import { useStore } from './store';

export const PipelineToolbar = () => {
  const clearWorkflow = useStore((state) => state.clearWorkflow);
const [confirmOpen, setConfirmOpen] = useState(false);

const handleNewWorkflow = () => {
  const { nodes, edges } = useStore.getState();
  if (nodes.length === 0 && edges.length === 0) {
    return;
  }
  setConfirmOpen(true);
};

return (
    <>
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
        <button
          onClick={handleNewWorkflow}
          style={{
            width: '100%',
            backgroundColor: '#000000',
            color: '#FFFFFF',
            border: 'none',
            padding: '10px',
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer'
          }}
        >
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

      {confirmOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 50,
          backdropFilter: 'blur(2px)',
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            padding: '32px',
            borderRadius: '12px',
            width: '320px',
            boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}>
            <h2 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: 700, color: '#111827' }}>
              Clear Canvas?
            </h2>
            <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#6B7280', lineHeight: 1.5 }}>
              Are you sure you want to create a new workflow? All unsaved progress will be lost.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setConfirmOpen(false)}
                style={{
                  flex: 1,
                  backgroundColor: '#FFFFFF',
                  color: '#111827',
                  border: '1px solid #D1D5DB',
                  padding: '10px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#F3F4F6'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#FFFFFF'}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearWorkflow();
                  setConfirmOpen(false);
                }}
                style={{
                  flex: 1,
                  backgroundColor: '#DC2626',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#B91C1C'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#DC2626'}
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
