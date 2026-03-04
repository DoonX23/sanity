// schemaTypes/documents/page.ts

import {defineField, defineType} from 'sanity'
import {pagebuilderOf} from '../objects/pagebuilder'

export const pageType = defineType({
  name: 'page',
  title: 'Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pagebuilder',
      title: 'Page Builder',
      type: 'array',
      description: '使用不同的内容块构建页面',
      of: pagebuilderOf,
    }),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {
    select: {title: 'title', slug: 'slug.current'},
    prepare({title, slug}) {
      return {title, subtitle: slug ? `/${slug}` : ''}
    },
  },
})