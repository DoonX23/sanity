// schemaTypes/objects/pagebuilder/productListBlock.ts

import {defineField, defineType} from 'sanity'

export const productListBlock = defineType({
  name: 'productListBlock',
  title: 'Product List Block',
  type: 'object',
  description: '产品列表占位 Block，用于在页面中预留产品列表展示位置',
  fields: [
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      options: {
        list: ['product List #1'],
      },
      initialValue: 'product List #1',
      validation: (r) => r.required(),
    }),
  ],
  preview: {
    select: {title: 'style'},
  },
})