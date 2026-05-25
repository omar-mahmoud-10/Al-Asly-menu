import { createClient } from 'next-sanity'
import { getProjectId, getDataset, token } from '../env'

export const client = createClient({
  projectId: getProjectId(),
  dataset: getDataset(),
  apiVersion: '2024-01-01',
  useCdn: false,
  perspective: 'published',
})

export const writeClient = createClient({
  projectId: getProjectId(),
  dataset: getDataset(),
  apiVersion: '2024-01-01',
  useCdn: false,
  token,
  perspective: 'published',
})
