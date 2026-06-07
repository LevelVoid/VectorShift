// output.config.js
// Config for the Output node — terminal sink of a pipeline.
// Receives a value and labels it as the pipeline's named result.

import { LogOut } from 'lucide-react';

const outputConfig = {
  title: 'Output',
  icon: <LogOut size={16} />,
  color: '#10B981',
  category: 'Core',
  inputs: [{ id: 'value', label: 'Value' }],
  outputs: [],
  fields: [
    {
      name: 'outputName',
      label: 'Name',
      type: 'text',
      default: '',
      placeholder: 'e.g. final_report',
    },
    {
      name: 'outputType',
      label: 'Type',
      type: 'select',
      options: ['Text', 'Image'],
      default: 'Text',
    },
  ],
};

export default outputConfig;
