import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'category',
  title: 'الفئات',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'اسم الفئة',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'الرابط',
      type: 'slug',
      options: { source: 'title' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'ترتيب العرض',
      type: 'number',
      description: 'رقم أقل = يظهر أولاً',
    }),
  ],
})
