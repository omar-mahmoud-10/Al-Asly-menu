import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { getProjectId, getDataset } from './env'
import { schemaTypes } from './schema'
import { structure } from './structure'

export default defineConfig({
  name: 'yaqut-store',
  title: ' الأصلي',
  basePath: '/studio',
  projectId: getProjectId() || '',
  dataset: getDataset(),
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: '2024-01-01' }),
  ],
  schema: {
    types: schemaTypes,
  },
})
