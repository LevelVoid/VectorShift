// nodes/index.js
// Central registry — single source of truth for all node types.
//
// To add a new node:
//   1. Create nodes/configs/myNode.config.js  (just data, no React)
//   2. Import it here and add one entry to NODE_CONFIGS
//   That's it. ui.js and toolbar.js update automatically.

import inputConfig      from './configs/input.config';
import outputConfig     from './configs/output.config';
import llmConfig        from './configs/llm.config';
import textConfig       from './configs/text.config';
import dataSourceConfig from './configs/dataSource.config';

export const NODE_CONFIGS = {
  customInput:  inputConfig,
  customOutput: outputConfig,
  llm:          llmConfig,
  text:         textConfig,
  dataSource:   dataSourceConfig,
};

// Order matters — defines the visual grouping in the toolbar
export const NODE_CATEGORIES = ['Core', 'Plugin'];
