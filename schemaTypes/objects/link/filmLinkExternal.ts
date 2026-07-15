// schemaTypes/objects/link/filmLinkExternal.ts
// Film 项目（project-b）专属外链类型。结构与 project-a 的 linkExternalType 一致，
// 但独立成文件以避免两个工作区的 schema 产生隐式耦合，便于未来各自演进。

import {EarthGlobeIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export const filmLinkExternalType = defineField({
  title: 'Film External Link',
  name: 'filmLinkExternal',
  type: 'object',
  icon: EarthGlobeIcon,
  fields: [
    defineField({
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule) => Rule.required().uri({scheme: ['http', 'https']}),
    }),
    defineField({
      title: 'Open in a new window?',
      name: 'newWindow',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'url'},
    prepare({title}) {
      return {
        title: title || 'Untitled URL',
        subtitle: 'Film External Link',
      }
    },
  },
})
