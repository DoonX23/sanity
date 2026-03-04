// schemaTypes/objects/pagebuilder/splitSection.ts

import {defineField, defineType} from 'sanity'
import {imageField, listField} from '../shared/fields'

export const splitSection = defineType({
  name: 'splitSection',
  title: 'Split Section',
  type: 'object',
  description: '左右分栏的图文布局',
  fields: [
    imageField('image', true),
    defineField({
      name: 'cta',
      title: 'Call to Action Tag',
      type: 'string',
      description: '顶部的号召标签文本',
    }),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({
      name: 'byline',
      title: 'Byline',
      type: 'text',
      description: '主要描述文本',
    }),
    listField('list'),
    defineField({name: 'buttonText', title: 'Primary Button Text', type: 'string'}),
    defineField({name: 'buttonLink', title: 'Button Link', type: 'string'}),
    defineField({name: 'secondaryButtonText', title: 'Secondary Button Text', type: 'string'}),
    defineField({name: 'secondaryButtonLink', title: 'Secondary Button Link', type: 'string'}),
    defineField({
      name: 'imageOnRight',
      title: 'Image on Right',
      type: 'boolean',
      description: '图片在右侧',
      initialValue: false,
    }),
    defineField({
      name: 'fullWidthImage',
      title: 'Full Width Image',
      type: 'boolean',
      description: '图片是否铺满屏幕边缘（全宽模式）',
      initialValue: false,
    }),
  ],
})