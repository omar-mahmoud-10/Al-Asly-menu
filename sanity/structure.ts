import type { StructureResolver } from 'sanity/structure'
import { schemaTypes } from './schema'

// Stable default sort per document type, so editing a document
// (e.g. changing a price) doesn't make it jump to the top of the list.
// Sanity's default ordering is "_updatedAt desc" (last edited first),
// which is exactly what makes edited items reorder after every save.
const DEFAULT_ORDERING: Record<string, { field: string; direction: 'asc' | 'desc' }[]> = {
  // Menu items: same order as the website (ترتيب العرض, then name)
  menuItem: [
    { field: 'order', direction: 'asc' },
    { field: 'name', direction: 'asc' },
  ],
  category: [
    { field: 'order', direction: 'asc' },
    { field: 'title', direction: 'asc' },
  ],
  deliveryPrice: [
    { field: 'order', direction: 'asc' },
    { field: 'area', direction: 'asc' },
  ],
  branch: [{ field: 'name', direction: 'asc' }],
  // Orders: newest first, and stable when viewed/status gets updated
  order: [{ field: 'createdAt', direction: 'desc' }],
  staffMember: [{ field: 'createdAt', direction: 'asc' }],
  accessRequest: [{ field: 'createdAt', direction: 'desc' }],
  pushSubscription: [{ field: 'createdAt', direction: 'desc' }],
}

export const structure: StructureResolver = (S) =>
  S.list()
    .title('المحتوى')
    .items(
      schemaTypes.map((type) => {
        const ordering = DEFAULT_ORDERING[type.name]
        if (!ordering) return S.documentTypeListItem(type.name)
        return S.documentTypeListItem(type.name).child(
          S.documentTypeList(type.name).defaultOrdering(ordering)
        )
      })
    )
