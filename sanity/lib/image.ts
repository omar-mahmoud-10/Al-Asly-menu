import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'
import { getProjectId, getDataset } from '../env'

const imageBuilder = createImageUrlBuilder({
  projectId: getProjectId() || '',
  dataset: getDataset(),
})

export function urlForImage(source: Image) {
  if (!source?.asset?._ref) {
    return undefined
  }
  return imageBuilder?.image(source).auto('format').fit('max')
}
