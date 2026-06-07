import { useState } from 'react';
import { useStore } from './store';
import { shallow } from 'zustand/shallow';

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
});

export const SubmitButton = () => {
  const { nodes, edges } = useStore(selector, shallow);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/pipelines/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nodes, edges }),
      });
      const data = await response.json();
      setResult(data);
      setModalOpen(true);
    } catch (error) {
      console.error(error);
      alert('Error submitting pipeline. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div style={{
        position: 'absolute',
        bottom: 24,
        right: 24,
        zIndex: 10,
      }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            backgroundColor: '#000000',
            color: '#FFFFFF',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            opacity: loading ? 0.7 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze Pipeline'}
        </button>
      </div>

      {modalOpen && result && (
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
            <h2 style={{ margin: '0 0 24px 0', fontSize: '20px', fontWeight: 700, color: '#111827' }}>
              Pipeline Analysis
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>
                <span style={{ color: '#6B7280', fontWeight: 500, fontSize: '14px' }}>Nodes</span>
                <span style={{ color: '#111827', fontWeight: 600, fontSize: '14px' }}>{result.num_nodes}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '12px', borderBottom: '1px solid #E5E7EB' }}>
                <span style={{ color: '#6B7280', fontWeight: 500, fontSize: '14px' }}>Edges</span>
                <span style={{ color: '#111827', fontWeight: 600, fontSize: '14px' }}>{result.num_edges}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#6B7280', fontWeight: 500, fontSize: '14px' }}>Graph Structure</span>
                <span style={{
                  color: result.is_dag ? '#059669' : '#DC2626',
                  backgroundColor: result.is_dag ? '#D1FAE5' : '#FEE2E2',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontWeight: 600,
                  fontSize: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}>
                  {result.is_dag ? 'Valid DAG ✓' : 'Cycle Detected ✗'}
                </span>
              </div>
            </div>
            <button
              onClick={() => setModalOpen(false)}
              style={{
                width: '100%',
                backgroundColor: '#F3F4F6',
                color: '#111827',
                border: '1px solid #D1D5DB',
                padding: '10px',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#E5E7EB'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#F3F4F6'}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
