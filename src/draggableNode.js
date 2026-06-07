// draggableNode.js
// A single draggable chip in the toolbar.
// Reads icon and color from the node's config — no hardcoded values.

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
        minWidth: 80,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 4,
        borderRadius: 8,
        background: '#1A1F2E',
        border: `1px solid ${config.color}`,
        userSelect: 'none',
        fontFamily: 'Inter, system-ui, sans-serif',
        transition: 'transform 0.1s ease, box-shadow 0.1s ease',
      }}
    >
      <span style={{ fontSize: 18, lineHeight: 1 }}>{config.icon}</span>
      <span style={{ color: '#E2E8F0', fontSize: 11, fontWeight: 500 }}>{config.title}</span>
    </div>
  );
};