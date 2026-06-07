// llm.config.js
// Config for the LLM node — the AI reasoning engine.
// Accepts a system prompt and a user prompt; returns the model's response.

import { BrainCircuit } from 'lucide-react';

const llmConfig = {
  title: 'LLM',
  icon: <BrainCircuit size={16} />,
  color: '#6C63FF',
  category: 'Core',
  inputs: [
    { id: 'system', label: 'System' },
    { id: 'prompt', label: 'Prompt' },
  ],
  outputs: [
    { id: 'response', label: 'Response' },
  ],
  fields: [
    {
      name: 'model',
      label: 'Model',
      type: 'select',
      options: ['gpt-4o', 'gpt-4-turbo', 'claude-3-5-sonnet', 'gemini-pro'],
      default: 'gpt-4o',
    },
  ],
};

export default llmConfig;
