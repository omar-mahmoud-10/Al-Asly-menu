import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'order',
  title: 'الطلبات',
  type: 'document',
  fields: [
    defineField({
      name: 'items',
      title: 'الأصناف',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'id', type: 'string', title: 'معرف' },
            { name: 'name', type: 'string', title: 'اسم الصنف' },
            { name: 'price', type: 'number', title: 'السعر' },
            { name: 'quantity', type: 'number', title: 'الكمية' },
          ],
        },
      ],
    }),
    defineField({
      name: 'totalPrice',
      title: 'الإجمالي',
      type: 'number',
    }),
    defineField({
      name: 'branch',
      title: 'الفرع',
      type: 'string',
    }),
    defineField({
      name: 'branchPhone',
      title: 'رقم الفرع',
      type: 'string',
    }),
    defineField({
      name: 'orderType',
      title: 'نوع الطلب',
      type: 'string',
    }),
    defineField({
      name: 'customerName',
      title: 'اسم العميل',
      type: 'string',
    }),
    defineField({
      name: 'customerAddress',
      title: 'العنوان',
      type: 'string',
    }),
    defineField({
      name: 'customerPhone',
      title: 'رقم العميل',
      type: 'string',
    }),
    defineField({
      name: 'status',
      title: 'الحالة',
      type: 'string',
      options: {
        list: [
          { title: 'بانتظار التأكيد', value: 'pending' },
          { title: 'مؤكد', value: 'confirmed' },
          { title: 'مكتمل', value: 'completed' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'viewed',
      title: 'تمت المشاهدة',
      type: 'boolean',
      initialValue: false,
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
      title: 'customerName',
      subtitle: 'totalPrice',
      status: 'status',
    },
    prepare({ title, subtitle }) {
      return {
        title: title || 'بدون اسم',
        subtitle: subtitle ? `${subtitle} جنيه` : '',
      }
    },
  },
  orderings: [
    {
      title: 'تاريخ الطلب',
      name: 'createdAt',
      by: [{ field: 'createdAt', direction: 'asc' }],
    },
  ],
})
