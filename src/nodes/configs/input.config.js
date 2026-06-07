// input.config.js
// Config for the Input node — entry point of a pipeline.
// Provides a named value (text or file) downstream.

import { LogIn } from 'lucide-react';

const inputConfig = {
  title: 'Input',
  icon: <LogIn size={16} />,
  color: '#22D3EE',
  category: 'Core',
  inputs: [],
  outputs: [{ id: 'value', label: 'Value' }],
  fields: [
    {
      name: 'inputName',
      label: 'Name',
      type: 'text',
      default: '',
      placeholder: 'e.g. user_query',
    },
    {
      name: 'inputType',
      label: 'Type',
      type: 'select',
      options: ['Text', 'File'],
      default: 'Text',
    },
  ],
};

export default inputConfig;
