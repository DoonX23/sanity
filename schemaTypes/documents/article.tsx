// schemaTypes/documents/article.tsx

import {BookIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {pagebuilderOf} from '../objects/pagebuilder'
import {imageField} from '../objects/shared/fields'  // ← 添加这一行
import { PathPreview } from '../../components/studio/PathPreview'

export const articleType = defineType({
  name: 'article',
  title: 'Article',
  type: 'document',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'pathPreview',
      title: ' ', // 留空，不占用多余标签空间
      type: 'string', // 类型是 string，但我们用自定义组件渲染它
      components: {
        field: PathPreview // 👈 挂载我们的 React 组件
      }
    }),
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

    imageField('image'),

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
    select: {seoImage: 'seo.image', title: 'title'},
    prepare({seoImage, title}) {
      return {media: seoImage, title}
    },
  },
})