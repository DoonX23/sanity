// schemaTypes/objects/pagebuilder/productBlock.ts

import {defineField, defineType} from 'sanity'

export const productBlock = defineType({
  name: 'productBlock',
  title: 'Product Block',
  type: 'object',
  description: '产品占位 Block，用于在页面中预留产品展示位置',
  fields: [
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: ['product #1'],
      },
      initialValue: 'product #1',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: {title: 'style'},
  },
})