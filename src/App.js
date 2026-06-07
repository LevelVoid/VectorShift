import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw' }}>
      {/* Top Navbar */}
      <header style={{ 
        height: '60px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 24px', 
        borderBottom: '1px solid var(--vs-border)',
        backgroundColor: 'var(--vs-surface)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {/* VectorShift Logo Text */}
          <div style={{ 
            fontSize: '22px', 
            fontWeight: 700, 
            letterSpacing: '-0.5px',
            color: '#000000',
            fontFamily: 'serif'
          }}>
            VectorShift
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <PipelineToolbar />
        <div style={{ flex: 1, position: 'relative' }}>
          <PipelineUI />
          <SubmitButton />
        </div>
      </div>
    </div>
  );
}

export default App;
