// schemaTypes/objects/nav/navLinkGroup.ts
// 覆盖 Developer Platform、Solutions 四个卡片、Global 两大分类下的 features、
// Popular Locations 下的四个地区块。
// description 可选：不填即"简单分组标题"（对应 Regions）。
// link 可选：不填即"标题不可点"（对应 Regions / Developer Platform）。
// style 控制视觉呈现：card（带内边距的卡片感，对应 Solutions）/ plain（无卡片感，对应 Global features、Regions）。

import {defineField} from 'sanity'

export const navLinkGroupType = defineField({
  name: 'navLinkGroup',
  title: 'Nav Link Group',
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
      description: '可选。留空即为简单分组标题（如 Regions 场景）',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'filmLink',
      description: '可选。留空则标题不可点（如 Regions / Developer Platform 场景）',
    }),
    defineField({
      name: 'style',
      title: 'Style',
      type: 'string',
      initialValue: 'plain',
      options: {
        layout: 'radio',
        list: [
          {title: 'Card（带内边距的卡片感）', value: 'card'},
          {title: 'Plain（无卡片感）', value: 'plain'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      of: [{type: 'navLinkItem'}],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {title: 'title', style: 'style', count: 'items.length'},
    prepare({title, style, count}) {
      return {
        title: title || 'Untitled group',
        subtitle: `Nav Link Group | ${style} | ${count || 0} items`,
      }
    },
  },
})
