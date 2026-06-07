// input.config.js
// Config for the Input node — entry point of a pipeline.
// Provides a named value (text or file) downstream.

const inputConfig = {
  title: 'Input',
  icon: '⬇',
  color: '#22D3EE',
  category: 'Core',
  inputs: [],
  outputs: [{ id: 'value', label: 'Value' }],
  fields: [
    {
      name: 'inputName',
      label: 'Name',
      type: 'text',
      default: 'input_1',
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
