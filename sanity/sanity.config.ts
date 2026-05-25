import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { getProjectId, getDataset } from './env'
import { schemaTypes } from './schema'

export default defineConfig({
  name: 'yaqut-store',
  title: ' الأصلي',
  projectId: getProjectId() || '',
  dataset: getDataset(),
  plugins: [
    structureTool(),
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],
  schema: {
    types: schemaTypes,
  },
})
