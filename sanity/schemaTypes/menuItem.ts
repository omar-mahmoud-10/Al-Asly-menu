import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'menuItem',
  title: 'عناصر القائمة',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'اسم المنتج',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'الرابط',
      type: 'slug',
      options: { source: 'name' },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'الوصف',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'price',
      title: 'السعر',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'image',
      title: 'صورة المنتج',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'category',
      title: 'الفئة',
      type: 'reference',
      to: [{ type: 'category' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: 'متوفر',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'order',
      title: 'ترتيب العرض',
      type: 'number',
      description: 'رقم أقل = يظهر أولاً',
    }),
    defineField({
      name: 'group',
      title: 'المجموعة',
      type: 'string',
      description: 'لتجميع الأوزان المختلفة لنفس الصنف (مثلاً: "ريش" لتجميع كيلو ريش، نصف كيلو ريش، ربع كيلو ريش) - اترك فارغاً إذا كان الصنف غير قابل للتقسيم',
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'price',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title,
        subtitle: subtitle ? `${subtitle} جنيه` : '',
        media,
      }
    },
  },
})
