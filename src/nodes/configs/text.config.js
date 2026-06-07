// text.config.js
// Config for the Text / Prompt Template node.
//
// Special behaviors declared here, handled entirely by BaseNode:
//   type: 'textarea'      → BaseNode renders an auto-resizing textarea
//   dynamicHandles: true  → BaseNode parses {{varName}} tokens from the
//                           field's value and renders a left-side Handle
//                           per unique variable, in real time.
//
// This is the "glue" node in a financial pipeline — it lets users compose
// prompts like "Analyze {{data}} regarding {{query}}" and then wire the
// {{data}} and {{query}} handles to upstream nodes (e.g. Data Source + Input).

import { Type } from 'lucide-react';

const textConfig = {
  title: 'Text',
  icon: <Type size={16} />,
  color: '#F59E0B',
  category: 'Core',
  inputs: [],        // populated dynamically by BaseNode from {{var}} parsing
  outputs: [{ id: 'output', label: 'Output' }],
  fields: [
    {
      name: 'text',
      label: 'Text',
      type: 'textarea',
      dynamicHandles: true,
      default: '',
      placeholder: 'e.g. Analyze {{data}} for the query: {{query}}',
    },
  ],
};

export default textConfig;
