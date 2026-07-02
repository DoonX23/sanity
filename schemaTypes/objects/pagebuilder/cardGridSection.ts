// schemaTypes/objects/pagebuilder/cardGridSection.ts

import {defineField, defineType} from 'sanity'
import {listField} from '../shared/fields'
import React from 'react' // <-- 新增：引入 React 用于渲染预览图片

export const cardGridSection = defineType({
  name: 'cardGridSection',
  title: 'Card Grid Section',
  type: 'object',
  description: '灵活的卡片网格布局',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'subheading', title: 'Subheading', type: 'string'}),
    
    // --- 结构配置 ---
    defineField({
      name: 'cardLayout',
      title: 'Card Layout (卡片布局)',
      type: 'string',
      options: {
        list: [
          {title: '左图右内容', value: 'imageLeft'},
          {title: '上图下内容', value: 'imageTop'},
        ],
      },
      initialValue: 'imageLeft',
    }),
    defineField({
      name: 'columns',
      title: 'Columns (列数)',
      type: 'number',
      validation: (Rule) => Rule.min(1).max(6),
      initialValue: 2,
    }),

    // --- 视觉样式配置 (语义化) ---
    defineField({
      name: 'theme',
      title: 'Section Theme (区块主题色)',
      type: 'string',
      options: {
        list: [
          {title: '浅色 (白底)', value: 'light'},
          {title: '灰色 (灰底)', value: 'gray'},
          {title: '深色 (黑底)', value: 'dark'},
        ],
      },
      initialValue: 'gray',
    }),
    defineField({
      name: 'cardStyle',
      title: 'Card Style (卡片外观)',
      type: 'string',
      options: {
        list: [
          {title: '扁平 (无边框, 轻微灰底)', value: 'flat'},
          {title: '阴影 (白底, 带阴影)', value: 'shadow'},
          {title: '边框 (白底, 带边框)', value: 'bordered'},
        ],
      },
      initialValue: 'flat',
    }),
    defineField({
      name: 'imageAspect',
      title: 'Image Aspect Ratio (图片比例)',
      type: 'string',
      options: {
        list: [
          {title: '4:3 (标准)', value: '4/3'},
          {title: '16:9 (宽屏)', value: '16/9'},
          {title: '1:1 (正方形)', value: '1/1'},
        ],
      },
      initialValue: '4/3',
    }),

    // --- 卡片内容数据 ---
    defineField({
      name: 'cards',
      title: 'Cards',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text'}),
            listField('list'),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'object',
              fields: [
                defineField({name: 'url', title: 'URL', type: 'url'}),
                defineField({name: 'alt', title: 'Alt Text', type: 'string'}),
              ],
            }),
            defineField({name: 'href', title: 'Link', type: 'string'}),
            defineField({name: 'readMore', title: 'Read More Text', type: 'string'}),
          ],
          preview: {
            select: {title: 'title', imageUrl: 'image.url'},
            prepare({title, imageUrl}) {
              return {
                title: title || 'Card without title',
                // 修复：将普通对象改为 React 元素，Sanity 就能正确渲染预览图了
                media: imageUrl 
                  ? React.createElement('img', { src: imageUrl, style: { objectFit: 'cover' } }) 
                  : undefined,
              }
            },
          },
        },
      ],
    }),
  ],
  preview: {
    select: {title: 'heading', subtitle: 'subheading', layout: 'cardLayout'},
    prepare({title, subtitle, layout}) {
      return {
        title: title || 'Card Grid Section',
        subtitle: `Card Grid Section | ${layout === 'imageTop' ? '上图下内容' : '左图右内容'}`,
      }
    },
  },
})