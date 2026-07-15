// schemaTypes/objects/nav/navLinkItem.ts
// megamenu 内的最小可点击单元。description 可选：留空即"简单链接"
// （对应 Developer Platform / Solutions 子项 / Regions 国家）；
// 填写则"带描述链接"（对应 Global features）。

import {defineField} from 'sanity'

export const navLinkItemType = defineField({
  name: 'navLinkItem',
  title: 'Nav Link Item',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'filmLink',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {title: 'title', subtitle: 'description'},
  },
})
