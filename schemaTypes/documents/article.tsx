// schemaTypes/documents/article.tsx

import {BookIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {pagebuilderOf} from '../objects/pagebuilder'
import {imageField} from '../objects/shared/fields'  // ← 添加这一行

export const articleType = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  icon: BookIcon,
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
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      description: '文章摘要或简短描述',
    }),
    defineField({
      name: 'parentArticle',
      title: 'Parent Article',
      type: 'reference',
      to: [{type: 'article'}],
      description: '选择父级文章，如果没有则为顶级文章',
    }),
    defineField({
      name: 'fullPath',
      title: 'Full Path',
      type: 'string',
      description: '完整路径，基于父级路径和当前slug自动生成',
      readOnly: true,
    }),
    imageField('image'),
    defineField({
      name: 'breadcrumb',
      title: 'Breadcrumb',
      type: 'array',
      description: '面包屑导航数据，自动生成',
      readOnly: true,
      of: [
        {
          type: 'object',
          fields: [
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'path', title: 'Path', type: 'string'}),
          ],
        },
      ],
    }),
    defineField({
      name: 'pagebuilder',
      title: 'Page Builder',
      type: 'array',
      description: '使用不同的内容块构建页面',
      of: pagebuilderOf,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'relativeCollections',
      title: 'Related Collections',
      type: 'array',
      description: '相关的产品集合',
      of: [{type: 'reference', to: [{type: 'collection'}]}],
    }),
    defineField({name: 'body', title: 'Body', type: 'portableText'}),
    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {
    select: {seoImage: 'seo.image', title: 'title', fullPath: 'fullPath'},
    prepare({seoImage, title, fullPath}) {
      return {media: seoImage, title, subtitle: fullPath}
    },
  },
})