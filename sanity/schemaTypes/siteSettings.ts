import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'siteSettings',
  title: 'إعدادات الموقع',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'عنوان',
      type: 'string',
      initialValue: 'إعدادات الموقع',
      readOnly: true,
    }),
    defineField({
      name: 'phone',
      title: 'رقم الهاتف',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'البريد الإلكتروني',
      type: 'string',
    }),
    defineField({
      name: 'location',
      title: 'الموقع',
      type: 'string',
    }),
    defineField({
      name: 'workingHoursWeekdays',
      title: 'ساعات العمل (السبت - الخميس)',
      type: 'string',
    }),
    defineField({
      name: 'workingHoursFriday',
      title: 'ساعات العمل (الجمعة)',
      type: 'string',
    }),
    defineField({
      name: 'instagramUrl',
      title: 'رابط انستغرام',
      type: 'url',
    }),
    defineField({
      name: 'facebookUrl',
      title: 'رابط فيسبوك',
      type: 'url',
    }),
    defineField({
      name: 'heroSubtitle',
      title: 'نص الهيرو الفرعي',
      type: 'string',
    }),
    defineField({
      name: 'heroTitle',
      title: 'عنوان الهيرو الرئيسي',
      type: 'string',
    }),
    defineField({
      name: 'heroDescription',
      title: 'وصف الهيرو',
      type: 'text',
      rows: 3,
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
