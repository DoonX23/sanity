// schemaTypes/objects/nav/navPromoCard.ts
// 唯一在结构上真正特殊的部分：图片 + 文案 + 单一整体链接。
// 出现在 Solutions 左上角、Global 左侧。

import {defineField} from 'sanity'
import {sanityImageField} from '../shared/fields'

export const navPromoCardType = defineField({
  name: 'navPromoCard',
  title: 'Nav Promo Card',
  type: 'object',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      description: '小标签文字，如 "Transform Your Workflow"',
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
    sanityImageField('image', 'Image', true),
    defineField({
      name: 'layout',
      title: 'Layout',
      type: 'string',
      initialValue: 'horizontal',
      options: {
        layout: 'radio',
        list: [
          {title: 'Horizontal（图右文左）', value: 'horizontal'},
          {title: 'Vertical（图上文下）', value: 'vertical'},
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'colSpan',
      title: '跨列数 (Column Span)',
      type: 'number',
      description: '控制该卡片在 Mega Menu 网格中占几列宽，不要超过所在 Mega Menu 的 Columns 设置',
      initialValue: 1,
      validation: (Rule) => Rule.min(1).max(4),
    }),
  ],
  preview: {
    select: {title: 'eyebrow', media: 'image', layout: 'layout'},
    prepare({title, media, layout}) {
      return {
        title: title || 'Untitled promo card',
        subtitle: `Nav Promo Card | ${layout}`,
        media,
      }
    },
  },
})
