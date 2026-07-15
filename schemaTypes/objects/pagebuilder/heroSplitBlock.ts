// schemaTypes/objects/pagebuilder/heroSplitSection.ts

import {defineField, defineType} from 'sanity'
import {listField, sanityImageField} from '../shared/fields'

export const heroSplitBlock = defineType({
  name: 'heroSplitBlock',
  title: 'Hero Split Block',
  type: 'object',
  description: '左右分栏图文布局，带徽标、按钮与要点列表',
  fields: [
    defineField({
      name: 'badge',
      title: 'Badge',
      type: 'object',
      fields: [
        defineField({name: 'text', title: 'Text', type: 'string'}),
        defineField({name: 'announcement', title: 'Announcement', type: 'string'}),
        defineField({name: 'url', title: 'URL', type: 'string'}),
      ],
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),
    listField('list'),
    defineField({
      name: 'buttons',
      title: 'Buttons',
      type: 'object',
      fields: [
        defineField({
          name: 'primary',
          title: 'Primary Button',
          type: 'object',
          fields: [
            defineField({name: 'text', title: 'Text', type: 'string'}),
            defineField({name: 'url', title: 'URL', type: 'string'}),
          ],
        }),
        defineField({
          name: 'secondary',
          title: 'Secondary Button',
          type: 'object',
          fields: [
            defineField({name: 'text', title: 'Text', type: 'string'}),
            defineField({name: 'url', title: 'URL', type: 'string'}),
          ],
        }),
      ],
    }),
    sanityImageField('sanityImage', 'Image', true),
  ],
  preview: {
    select: {title: 'heading', media: 'sanityImage'},
  },
})