import { defineCliConfig } from 'sanity/cli'
import { getProjectId, getDataset } from './env'

export default defineCliConfig({
  api: {
    projectId: getProjectId() || '',
    dataset: getDataset(),
  },
})
