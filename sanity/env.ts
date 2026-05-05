export function getProjectId() {
  if (typeof document === 'undefined') {
    return process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  }
  return process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
}

export function getDataset() {
  return process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
}

export const token = process.env.SANITY_API_TOKEN
