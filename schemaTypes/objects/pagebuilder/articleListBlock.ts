// schemaTypes/objects/pagebuilder/articleListBlock.ts

import {defineField, defineType} from 'sanity'

export const articleListBlock = defineType({
  name: 'articleListBlock',
  title: 'Article List Block',
  type: 'object',
  description: '文章列表占位 Block，用于在页面中预留文章列表展示位置',
  fields: [
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: ['article List #1'],
      },
      initialValue: 'article List #1',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: {title: 'style'},
  },
})