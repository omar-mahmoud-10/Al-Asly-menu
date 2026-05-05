import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'deliveryPrice',
  title: 'أسعار التوصيل',
  type: 'document',
  fields: [
    defineField({
      name: 'area',
      title: 'المنطقة',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'السعر',
      type: 'string',
      description: 'مثال: ١٥ جنيهاً',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'bookingPrice',
      title: 'سعر الحجز (اختياري)',
      type: 'string',
      description: 'مثال: ٦٥ جنيهاً',
    }),
    defineField({
      name: 'order',
      title: 'ترتيب العرض',
      type: 'number',
    }),
  ],
})
