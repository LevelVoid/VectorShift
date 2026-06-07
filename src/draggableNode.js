export const DraggableNode = ({ type, config }) => {
  const onDragStart = (event) => {
    event.target.style.cursor = 'grabbing';
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ nodeType: type }));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div
      className={type}
      onDragStart={onDragStart}
      onDragEnd={(e) => (e.target.style.cursor = 'grab')}
      draggable
      title={config.title}
      style={{
        cursor: 'grab',
        display: 'flex',
        alignItems: 'center',
        padding: '10px 12px',
        borderRadius: '6px',
        userSelect: 'none',
        transition: 'background-color 0.15s ease',
      }}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
    >
      {/* Icon */}
      <span style={{ 
        fontSize: '16px', 
        marginRight: '12px', 
        display: 'flex', 
        alignItems: 'center', 
        color: '#4B5563',
        width: '20px',
        justifyContent: 'center'
      }}>
        {config.icon}
      </span>
      {/* Label */}
      <span style={{ 
        color: 'var(--vs-text)', 
        fontSize: '14px', 
        fontWeight: 500 
      }}>
        {config.title}
      </span>
    </div>
  );
};