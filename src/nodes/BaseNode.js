import { useState, useRef, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

const VAR_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

const extractVariables = (text) => {
  const vars = [];
  const seen = new Set();
  const regex = new RegExp(VAR_REGEX.source, 'g');
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (!seen.has(match[1])) {
      vars.push(match[1]);
      seen.add(match[1]);
    }
  }
  return vars;
};

const getHandleStyle = (index, total) => ({
  top: `${((index + 1) / (total + 1)) * 100}%`,
});

const computeWidth = (text, base = 260) => {
  const maxLineLen = Math.max(...(text || '').split('\n').map((l) => l.length), 0);
  return Math.min(480, Math.max(base, maxLineLen * 8 + 48));
};

export const BaseNode = ({ id, data, selected, nodeConfig }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const textareaRefs = useRef({});

  const dynamicField = nodeConfig.fields?.find((f) => f.dynamicHandles);

  const [dynamicVars, setDynamicVars] = useState(() =>
    dynamicField
      ? extractVariables(data[dynamicField.name] ?? dynamicField.default ?? '')
      : []
  );

  const [nodeWidth, setNodeWidth] = useState(() => {
    if (!dynamicField) return null;
    return computeWidth(data[dynamicField.name] ?? dynamicField.default ?? '');
  });

  const handleChange = useCallback(
    (fieldName, value, field) => {
      updateNodeField(id, fieldName, value);

      if (field?.dynamicHandles) {
        setDynamicVars(extractVariables(value));
        setNodeWidth(computeWidth(value));
      }
    },
    [id, updateNodeField]
  );

  const renderField = (field) => {
    const value = data[field.name] ?? field.default ?? '';

    switch (field.type) {
      case 'select':
        return (
          <div key={field.name} style={styles.fieldWrapper}>
            <label style={styles.label}>{field.label}</label>
            <select
              style={styles.select}
              value={value}
              onChange={(e) => handleChange(field.name, e.target.value, field)}
            >
              {field.options.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        );

      case 'textarea':
        return (
          <div key={field.name} style={styles.fieldWrapper}>
            <label style={styles.label}>{field.label}</label>
            <textarea
              ref={(el) => { textareaRefs.current[field.name] = el; }}
              style={styles.textarea}
              value={value}
              placeholder={field.placeholder}
              onChange={(e) => {
                const val = e.target.value;
                handleChange(field.name, val, field);
                const el = textareaRefs.current[field.name];
                if (el) {
                  el.style.height = 'auto';
                  el.style.height = `${el.scrollHeight}px`;
                }
              }}
            />
          </div>
        );

      default:
        return (
          <div key={field.name} style={styles.fieldWrapper}>
            <label style={styles.label}>{field.label}</label>
            <input
              type="text"
              style={styles.input}
              value={value}
              placeholder={field.placeholder}
              onChange={(e) => handleChange(field.name, e.target.value, field)}
            />
          </div>
        );
    }
  };

  const targetHandles = [
    ...nodeConfig.inputs,
    ...dynamicVars.map((v) => ({ id: v, label: v, dynamic: true })),
  ];

  const sourceHandles = nodeConfig.outputs;

  return (
    <div
      style={{
        ...styles.node,
        ...(nodeWidth ? { width: nodeWidth } : {}),
        borderColor: selected ? '#6C63FF' : '#D1D5DB', // Highlight with VectorShift purple
        boxShadow: selected
          ? `0 0 0 1px #6C63FF, 0 4px 12px rgba(0,0,0,0.08)`
          : '0 2px 6px rgba(0,0,0,0.04)',
      }}
    >
      {/* ── Target Handles (left) ── */}
      {targetHandles.map((handle, i) => (
        <Handle
          key={handle.id}
          type="target"
          position={Position.Left}
          id={`${id}-${handle.id}`}
          style={{
            ...styles.handle,
            ...getHandleStyle(i, targetHandles.length),
            borderColor: handle.dynamic ? '#6C63FF' : '#9CA3AF',
          }}
          title={handle.label}
        />
      ))}

      {/* ── Header ── */}
      <div style={styles.header}>
        <div style={styles.titleWrapper}>
          <span style={styles.title}>{nodeConfig.title}</span>
        </div>
        <span style={styles.icon}>{nodeConfig.icon}</span>
      </div>

      {/* ── Body ── */}
      <div style={styles.body}>
        {(nodeConfig.fields || []).map(renderField)}
      </div>

      {/* ── Source Handles (right) ── */}
      {sourceHandles.map((handle, i) => (
        <Handle
          key={handle.id}
          type="source"
          position={Position.Right}
          id={`${id}-${handle.id}`}
          style={{
            ...styles.handle,
            ...getHandleStyle(i, sourceHandles.length),
          }}
          title={handle.label}
        />
      ))}
    </div>
  );
};

const styles = {
  node: {
    minWidth: 260,
    background: '#FFFFFF',
    border: '1px solid #D1D5DB',
    borderRadius: 8,
    fontFamily: 'Inter, system-ui, sans-serif',
    transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
    position: 'relative',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 16px',
    borderBottom: '1px solid #E5E7EB',
    borderRadius: '8px 8px 0 0',
    background: '#FFFFFF',
  },
  titleWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: '#111827',
    userSelect: 'none',
  },
  body: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  fieldWrapper: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    display: 'block',
    fontSize: 10,
    fontWeight: 600,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
    userSelect: 'none',
  },
  input: {
    width: '100%',
    fontSize: 13,
    padding: '8px 10px',
    background: '#FFFFFF',
    border: '1px solid #D1D5DB',
    borderRadius: 4,
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box',
    fontFamily: 'Inter, system-ui, sans-serif',
    transition: 'border-color 0.15s ease',
  },
  select: {
    width: '100%',
    fontSize: 13,
    padding: '8px 10px',
    background: '#FFFFFF',
    border: '1px solid #D1D5DB',
    borderRadius: 4,
    color: '#111827',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer',
    fontFamily: 'Inter, system-ui, sans-serif',
    transition: 'border-color 0.15s ease',
  },
  textarea: {
    width: '100%',
    minHeight: 60,
    fontSize: 13,
    padding: '8px 10px',
    background: '#FFFFFF',
    border: '1px solid #D1D5DB',
    borderRadius: 4,
    color: '#111827',
    outline: 'none',
    resize: 'none',
    overflow: 'hidden',
    boxSizing: 'border-box',
    fontFamily: 'monospace',
    lineHeight: 1.5,
    transition: 'border-color 0.15s ease',
  },
  handle: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#FFFFFF',
    border: '1.5px solid #9CA3AF',
  },
};
