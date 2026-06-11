import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'accessRequest',
  title: 'طلبات الوصول',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'البريد الإلكتروني',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'status',
      title: 'الحالة',
      type: 'string',
      options: {
        list: [
          { title: 'قيد الانتظار', value: 'pending' },
          { title: 'مقبول', value: 'approved' },
          { title: 'مرفوض', value: 'denied' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'createdAt',
      title: 'تاريخ الطلب',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'email',
      subtitle: 'status',
    },
    prepare({ title, subtitle }) {
      const statusLabels: Record<string, string> = {
        pending: 'قيد الانتظار',
        approved: 'مقبول',
        denied: 'مرفوض',
      }
      return {
        title: title || 'بدون بريد',
        subtitle: subtitle ? statusLabels[subtitle] || subtitle : '',
      }
    },
  },
})
