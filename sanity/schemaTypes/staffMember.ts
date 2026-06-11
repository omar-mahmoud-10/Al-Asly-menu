import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'staffMember',
  title: 'فريق العمل',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'البريد الإلكتروني',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'role',
      title: 'الصلاحية',
      type: 'string',
      options: {
        list: [
          { title: 'مدير', value: 'admin' },
          { title: 'مشرف', value: 'manager' },
          { title: 'موظف', value: 'staff' },
        ],
      },
      initialValue: 'staff',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'createdAt',
      title: 'تاريخ الإضافة',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'email',
      subtitle: 'role',
    },
    prepare({ title, subtitle }) {
      const roleLabels: Record<string, string> = {
        admin: 'مدير',
        manager: 'مشرف',
        staff: 'موظف',
      }
      return {
        title: title || 'بدون بريد',
        subtitle: subtitle ? roleLabels[subtitle] || subtitle : '',
      }
    },
  },
})
