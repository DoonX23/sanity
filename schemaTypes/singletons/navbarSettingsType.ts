// schemaTypes/singletons/navbarSettingsType.ts
// Film 项目（project-b）专属导航单例，独立于 project-a 的 settings（后者是 Shopify 导航体系，
// 基于 collection/product 引用，与本项目 megamenu 结构完全不同，不复用/不合并）。

import {MenuIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {sanityImageField} from '../objects/shared/fields'

const TITLE = 'Navbar Settings'

export const navbarSettingsType = defineType({
  name: 'navbarSettings',
  title: TITLE,
  type: 'document',
  icon: MenuIcon,
  fields: [
    sanityImageField('logo', 'Logo', true),
    defineField({
      name: 'items',
      title: 'Nav Items',
      type: 'array',
      of: [{type: 'navItem'}],
    }),
    defineField({
      name: 'ctaButton',
      title: 'CTA Button',
      type: 'object',
      description: '可选。留空时前端不渲染该按钮（如 Login）',
      fields: [
        defineField({
          name: 'text',
          title: 'Text',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'link',
          title: 'Link',
          type: 'filmLink',
          validation: (Rule) => Rule.required(),
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {
        media: MenuIcon,
        title: TITLE,
      }
    },
  },
})
