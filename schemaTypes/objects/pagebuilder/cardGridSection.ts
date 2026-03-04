// schemaTypes/objects/pagebuilder/cardGridSection.ts

import {defineField, defineType} from 'sanity'
import {listField} from '../shared/fields'

export const cardGridSection = defineType({
  name: 'cardGridSection',
  title: 'Card Grid Section',
  type: 'object',
  description: '灵活的卡片网格布局',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'subheading', title: 'Subheading', type: 'string'}),
    defineField({
      name: 'cardLayout',
      title: 'Card Layout',
      type: 'string',
      options: {
        list: [
          {title: '左图右内容', value: 'imageLeft'},
          {title: '上图下内容', value: 'imageTop'},
        ],
      },
      initialValue: 'imageLeft',
    }),
    defineField({
      name: 'columns',
      title: 'Columns',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(6),
      initialValue: 2,
    }),
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text'}),
            listField('list'),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'object',
              fields: [
                defineField({name: 'url', title: 'URL', type: 'url'}),
                defineField({name: 'alt', title: 'Alt Text', type: 'string'}),
              ],
            }),
            defineField({name: 'href', title: 'Link', type: 'string'}),
            defineField({name: 'readMore', title: 'Read More Text', type: 'string'}),
          ],
          preview: {
            select: {title: 'title', imageUrl: 'image.url'},
            prepare({title, imageUrl}) {
              return {
                title: title || 'Card without title',
                media: imageUrl ? {url: imageUrl} : undefined,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'sectionStyles',
      title: 'Section Styles',
      type: 'object',
      description: '区块样式（Tailwind CSS）',
      fields: [
        defineField({name: 'section', title: 'Section Styles', type: 'string'}),
        defineField({name: 'container', title: 'Container Styles', type: 'string'}),
        defineField({name: 'headerWrapper', title: 'Header Wrapper Styles', type: 'string'}),
        defineField({name: 'heading', title: 'Heading Styles', type: 'string'}),
        defineField({name: 'subheading', title: 'Subheading Styles', type: 'string'}),
      ],
    }),
    defineField({
      name: 'cardStyles',
      title: 'Card Styles',
      type: 'object',
      description: '卡片样式（Tailwind CSS）',
      fields: [
        defineField({name: 'title', title: 'Title Styles', type: 'string'}),
        defineField({name: 'description', title: 'Description Styles', type: 'string'}),
        defineField({name: 'readMore', title: 'Read More Styles', type: 'string'}),
        defineField({name: 'card', title: 'Card Container Styles', type: 'string'}),
        defineField({name: 'cardContent', title: 'Card Content Styles', type: 'string'}),
        defineField({name: 'image', title: 'Image Styles', type: 'string'}),
        defineField({name: 'imageAspect', title: 'Image Aspect Ratio', type: 'string'}),
      ],
    }),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'subheading', layout: 'cardLayout'},
    prepare({title, subtitle, layout}) {
      return {
        title: title || 'Card Grid Section',
        subtitle: `${layout === 'imageTop' ? '上图下内容' : '左图右内容'} | ${subtitle || ''}`,
      }
    },
  },
})