// dataSource.config.js
// Config for the Data Source plugin node.
//
// Represents an external data connection: market data APIs, document stores,
// knowledge bases, or databases. In a financial automation pipeline this is
// the RAG input layer — it fetches context that the Text node templates
// and the LLM node reasons over.
//
// Example flow:
//   [Data Source: Market API] ──→ [Text: "Analyze {{data}} for {{query}}"] ──→ [LLM]

const dataSourceConfig = {
  title: 'Data Source',
  icon: '🔌',
  color: '#06B6D4',
  category: 'Plugin',
  inputs: [
    { id: 'query', label: 'Query' },   // optional: dynamic query from upstream
  ],
  outputs: [
    { id: 'data',     label: 'Data'     },
    { id: 'metadata', label: 'Metadata' },
  ],
  fields: [
    {
      name: 'sourceType',
      label: 'Source Type',
      type: 'select',
      options: ['Market Data API', 'Document Store', 'Knowledge Base', 'Database', 'Web Scraper'],
      default: 'Market Data API',
    },
    {
      name: 'endpoint',
      label: 'Endpoint / URL',
      type: 'text',
      default: '',
      placeholder: 'https://api.example.com/v1/data',
    },
    {
      name: 'authType',
      label: 'Auth',
      type: 'select',
      options: ['None', 'API Key', 'Bearer Token', 'OAuth2'],
      default: 'None',
    },
  ],
};

export default dataSourceConfig;
