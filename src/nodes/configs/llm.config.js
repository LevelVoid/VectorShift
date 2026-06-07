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
      options: ['claude-sonnet-4.6', 'claude-opus-4.8', 'gemini-3.1-pro', 'gpt-5.1'],
      default: 'claude-sonnet-4.6',
    },
  ],
};

export default llmConfig;
