// schemaTypes/objects/nav/navItem.ts
// 一级导航项：simpleLink（直接跳转）或 megamenu（展开下拉大菜单）。
// columns 控制 megamenu 外层网格列数，解决 Solutions（4 列）与 Global（不同列数）视觉差异，
// 编辑在 Studio 中直接选数字即可，无需为不同列数单独建类型（写法参照 cardGridSection.columns）。

import {defineField} from 'sanity'

export const navItemType = defineField({
  name: 'navItem',
  title: 'Nav Item',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      initialValue: 'simpleLink',
      options: {
        layout: 'radio',
        list: [
          {title: 'Simple Link', value: 'simpleLink'},
          {title: 'Mega Menu', value: 'megamenu'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'filmLink',
      hidden: ({parent}) => parent?.type !== 'simpleLink',
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          if (context.parent?.type === 'simpleLink' && !value) {
            return 'Required'
          }
          return true
        }),
    }),
    defineField({
      name: 'columns',
      title: 'Columns (列数)',
      type: 'number',
      description: '控制 Mega Menu 外层网格列数',
      initialValue: 2,
      validation: (Rule) => Rule.min(1).max(4),
      hidden: ({parent}) => parent?.type !== 'megamenu',
    }),
    defineField({
      name: 'megamenuContent',
      title: 'Mega Menu Content',
      type: 'array',
      description: '可混合排列 Promo Card 与 Link Group，可拖拽排序',
      of: [{type: 'navPromoCard'}, {type: 'navLinkGroup'}],
      hidden: ({parent}) => parent?.type !== 'megamenu',
    }),
  ],
  preview: {
    select: {title: 'label', type: 'type'},
    prepare({title, type}) {
      return {
        title: title || 'Untitled nav item',
        subtitle: `Nav Item | ${type}`,
      }
    },
  },
})
