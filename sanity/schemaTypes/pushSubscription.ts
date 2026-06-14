import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'pushSubscription',
  title: 'اشتراكات الإشعارات',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'البريد الإلكتروني',
      type: 'string',
    }),
    defineField({
      name: 'subscription',
      title: 'بيانات الاشتراك',
      type: 'object',
      fields: [
        { name: 'endpoint', type: 'string', title: 'Endpoint' },
        {
          name: 'keys',
          type: 'object',
          title: 'Keys',
          fields: [
            { name: 'p256dh', type: 'string', title: 'P256DH' },
            { name: 'auth', type: 'string', title: 'Auth' },
          ],
        },
      ],
    }),
    defineField({
      name: 'createdAt',
      title: 'تاريخ الاشتراك',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: 'email',
      subtitle: 'createdAt',
    },
  },
})
