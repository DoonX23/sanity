import {defineField} from 'sanity'

export const seoType = defineField({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  group: 'seo',
  options: {
    collapsed: false,
    collapsible: true,
  },
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (Rule) =>
        Rule.max(50).warning('Longer titles may be truncated by search engines'),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 2,
      validation: (Rule) =>
        Rule.max(150).warning('Longer descriptions may be truncated by search engines'),
    }),
    defineField({
      name: 'image',
      type: 'image',
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      description: 'If enabled, this page will not be indexed by search engines.',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'canonical',
      title: 'Canonical URL',
      description: 'Custom canonical URL if different from the normal page URL.',
      type: 'url',
    }),
  ],
})
