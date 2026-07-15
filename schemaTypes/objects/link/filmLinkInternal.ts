// schemaTypes/objects/link/filmLinkInternal.ts
// Film 项目（project-b）专属内链类型：仅引用 routeNode 文档。
// 不复用/不修改 project-a 的 linkInternalType（其 to 硬编码 PAGE_REFERENCES，与本项目路由树结构不同）。
// 注意：Studio 端仅存储 routeNode 的弱引用，完整 URL 路径由 Film 前端在 loader 中
// 通过 routeNode 的 parent 链递归拼接得出，Schema 层不负责、也无法计算完整路径。

import {LinkIcon} from '@sanity/icons'
import {defineField} from 'sanity'

export const filmLinkInternalType = defineField({
  title: 'Film Internal Link',
  name: 'filmLinkInternal',
  type: 'object',
  icon: LinkIcon,
  fields: [
    defineField({
      name: 'reference',
      title: 'Route Node',
      type: 'reference',
      weak: true,
      to: [{type: 'routeNode'}],
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'reference.title'},
    prepare({title}) {
      return {
        title: title || 'Untitled route node',
        subtitle: 'Film Internal Link',
      }
    },
  },
})
