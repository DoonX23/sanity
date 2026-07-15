// schemaTypes/objects/pagebuilder/freeContent.ts

import {defineField, defineType} from 'sanity'

export const freeContent = defineType({
  name: 'freeContent',
  title: 'Free Content',
  type: 'object',
  description: '自由内容 Block，用于在页面中添加任意富文本内容',
  fields: [
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {
      blocks: 'body',
    },
    prepare({blocks}) {
      const block = (blocks || []).find((b: { _type: string; children?: { text: string }[] }) => b._type === 'block')
      return {
        title: block
          ? block.children
              ?.filter((child: { _type: string; text: string }) => child._type === 'span')
              .map((span: { text: string }) => span.text)
              .join('')
          : 'No content',
      }
    },
  },
})
