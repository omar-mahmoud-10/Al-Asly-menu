import { createClient } from 'next-sanity'
import { getProjectId, getDataset, token } from '../env'

export const client = createClient({
  projectId: getProjectId(),
  dataset: getDataset(),
  apiVersion: '2024-01-01',
  useCdn: process.env.NODE_ENV === 'production',
  token,
  perspective: 'published',
})
