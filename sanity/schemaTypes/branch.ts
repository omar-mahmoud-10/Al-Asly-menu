import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'branch',
  title: 'الفروع',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'اسم الفرع',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'الموقع',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'رقم الهاتف',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'العنوان التفصيلي',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'isActive',
      title: 'نشط',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})
