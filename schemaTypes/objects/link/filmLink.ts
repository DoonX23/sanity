// schemaTypes/objects/link/filmLink.ts
// Film 项目（project-b）统一"单一链接"字段：编辑通过 radio 在 internal/external 间二选一。
// 参照项目里 linkProductType 已有的"父字段决定子字段显隐"写法（hidden: ({parent}) => ...）。

import {defineField} from 'sanity'

export const filmLinkType = defineField({
  title: 'Link',
  name: 'filmLink',
  type: 'object',
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      initialValue: 'internal',
      options: {
        layout: 'radio',
        list: [
          {title: 'Internal', value: 'internal'},
          {title: 'External', value: 'external'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'internal',
      title: 'Route Node',
      type: 'reference',
      weak: true,
      to: [{type: 'routeNode'}],
      hidden: ({parent}) => parent?.linkType !== 'internal',
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          if (context.parent?.linkType === 'internal' && !value) {
            return 'Required'
          }
          return true
        }),
    }),
    defineField({
      name: 'external',
      title: 'URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
      validation: (Rule) =>
        Rule.uri({scheme: ['http', 'https']}).custom((value, context: any) => {
          if (context.parent?.linkType === 'external' && !value) {
            return 'Required'
          }
          return true
        }),
    }),
    defineField({
      name: 'newWindow',
      title: 'Open in a new window?',
      type: 'boolean',
      initialValue: true,
      hidden: ({parent}) => parent?.linkType !== 'external',
    }),
  ],
  preview: {
    select: {linkType: 'linkType', internalTitle: 'internal.title', external: 'external'},
    prepare({linkType, internalTitle, external}) {
      return {
        title: linkType === 'internal' ? internalTitle || 'Untitled route node' : external || 'Untitled URL',
        subtitle: linkType === 'internal' ? 'Internal' : 'External',
      }
    },
  },
})
