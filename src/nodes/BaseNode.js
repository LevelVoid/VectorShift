// nodes/BaseNode.js
// The ONE and ONLY React component for all node types.
//
// Receives `nodeConfig` (from NODE_CONFIGS) as a prop and renders
// the appropriate handles, header, and form fields automatically.
//
// Special behaviors driven entirely by config flags (no per-node files):
//   field.type === 'textarea'    → auto-resizing textarea (height + width)
//   field.dynamicHandles === true → parses {{varName}} from field value
//                                   and creates a live left-side Handle per variable

import { useState, useRef, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { useStore } from '../store';

// Matches valid JS identifiers inside {{ }} — e.g. {{input}}, {{user_query}}
const VAR_REGEX = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;

/**
 * Extracts unique, ordered variable names from a template string.
 * "Hello {{name}}, your {{ticker}} report" → ['name', 'ticker']
 */
const extractVariables = (text) => {
  const vars = [];
  const seen = new Set();
  // Always create a fresh regex instance — RegExp with /g flag is stateful
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

/**
 * Distributes N handles evenly along the node edge.
 * i=0 of 1 total → 50% | i=0 of 2 total → 33% | i=1 of 2 total → 66%
 */
const getHandleStyle = (index, total) => ({
  top: `${((index + 1) / (total + 1)) * 100}%`,
});

/**
 * Estimates a good node width for textarea nodes based on longest line.
 * Keeps nodes readable without letting them grow unbounded.
 */
const computeWidth = (text, base = 220) => {
  const maxLineLen = Math.max(...(text || '').split('\n').map((l) => l.length), 0);
  return Math.min(480, Math.max(base, maxLineLen * 8 + 48));
};

export const BaseNode = ({ id, data, selected, nodeConfig }) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const textareaRefs = useRef({});

  // Find the field (if any) that drives dynamic handles — there can be at most one per node
  const dynamicField = nodeConfig.fields?.find((f) => f.dynamicHandles);

  // Initialise dynamic variable handles from existing node data (handles re-opening saved pipelines)
  const [dynamicVars, setDynamicVars] = useState(() =>
    dynamicField
      ? extractVariables(data[dynamicField.name] ?? dynamicField.default ?? '')
      : []
  );

  // Track node width only for textarea nodes — others use a fixed minWidth
  const [nodeWidth, setNodeWidth] = useState(() => {
    if (!dynamicField) return null; // null → use CSS minWidth
    return computeWidth(data[dynamicField.name] ?? dynamicField.default ?? '');
  });

  // Stable callback — only recreated if id changes (which it never does for a mounted node)
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

  // ─── Field Renderers ────────────────────────────────────────────────────────

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
                // Height auto-resize: reset → measure scrollHeight → apply
                const el = textareaRefs.current[field.name];
                if (el) {
                  el.style.height = 'auto';
                  el.style.height = `${el.scrollHeight}px`;
                }
              }}
            />
          </div>
        );

      default: // 'text'
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

  // ─── Handle Lists ───────────────────────────────────────────────────────────

  // Left side: static config inputs + any variables parsed from template fields
  const targetHandles = [
    ...nodeConfig.inputs,
    ...dynamicVars.map((v) => ({ id: v, label: v, dynamic: true })),
  ];

  const sourceHandles = nodeConfig.outputs;

  // ─── Render ─────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        ...styles.node,
        ...(nodeWidth ? { width: nodeWidth } : {}),
        borderColor: selected ? nodeConfig.color : '#2D3348',
        boxShadow: selected
          ? `0 0 0 1.5px ${nodeConfig.color}, 0 4px 20px rgba(0,0,0,0.4)`
          : '0 2px 10px rgba(0,0,0,0.3)',
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
            background: handle.dynamic ? nodeConfig.color : '#555',
            border: `2px solid ${handle.dynamic ? nodeConfig.color : '#888'}`,
          }}
          title={handle.label}
        />
      ))}

      {/* ── Header ── */}
      <div style={{ ...styles.header, borderLeftColor: nodeConfig.color }}>
        <span style={styles.icon}>{nodeConfig.icon}</span>
        <span style={styles.title}>{nodeConfig.title}</span>
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
            background: nodeConfig.color,
            border: `2px solid ${nodeConfig.color}`,
          }}
          title={handle.label}
        />
      ))}
    </div>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────────
// Kept as a plain object here so Part 2 (index.css) can cleanly replace them
// with CSS classes without touching any logic in this file.

const styles = {
  node: {
    minWidth: 220,
    background: '#1A1F2E',
    border: '1px solid #2D3348',
    borderRadius: 8,
    fontFamily: 'Inter, system-ui, sans-serif',
    transition: 'box-shadow 0.15s ease, border-color 0.15s ease',
    position: 'relative',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '8px 12px',
    borderBottom: '1px solid #2D3348',
    borderLeft: '3px solid transparent', // overridden per-node via nodeConfig.color
    borderRadius: '8px 8px 0 0',
    background: 'rgba(255,255,255,0.03)',
  },
  icon: {
    fontSize: 14,
    lineHeight: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: 600,
    color: '#E2E8F0',
    letterSpacing: 0.3,
    userSelect: 'none',
  },
  body: {
    padding: '10px 12px',
  },
  fieldWrapper: {
    marginBottom: 8,
  },
  label: {
    display: 'block',
    fontSize: 10,
    fontWeight: 500,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 3,
    userSelect: 'none',
  },
  input: {
    width: '100%',
    fontSize: 12,
    padding: '4px 7px',
    background: '#0D0F14',
    border: '1px solid #2D3348',
    borderRadius: 4,
    color: '#E2E8F0',
    outline: 'none',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    fontSize: 12,
    padding: '4px 7px',
    background: '#0D0F14',
    border: '1px solid #2D3348',
    borderRadius: 4,
    color: '#E2E8F0',
    outline: 'none',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },
  textarea: {
    width: '100%',
    minHeight: 60,
    fontSize: 12,
    padding: '4px 7px',
    background: '#0D0F14',
    border: '1px solid #2D3348',
    borderRadius: 4,
    color: '#E2E8F0',
    outline: 'none',
    resize: 'none',
    overflow: 'hidden',
    boxSizing: 'border-box',
    fontFamily: 'monospace',
    lineHeight: 1.5,
  },
  handle: {
    width: 10,
    height: 10,
    borderRadius: '50%',
  },
};
