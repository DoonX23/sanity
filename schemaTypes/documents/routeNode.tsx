// schemaTypes/documents/routeNode.tsx

import {CubeIcon} from '@sanity/icons' // ← 图标改为更贴合"路径节点"语义，原 BookIcon 偏文章化
// import {BookIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {pagebuilderOf} from '../objects/pagebuilder' // of 数组已含 articleList/freeContent 等 Section
import {PathPreview} from '../../components/studio/PathPreview'
import {sanityImageField} from '../objects/shared/fields'

export const routeNodeType = defineType({
  name: 'routeNode', // ← 由 'article' 改为 'routeNode'
  title: 'Route Node', // ← 由 'Article' 改为 'Route Node'
  type: 'document',
  icon: CubeIcon,
  fields: [
    defineField({
      name: 'pathPreview',
      title: ' ',
      type: 'string',
      components: {
        field: PathPreview // 路径预览组件通用，无需改动；依赖下方 parent 字段递归展示完整 URL
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
      description: '摘要/简述，可作为 SEO Description 的人工兜底文案（防薄内容 WebPage 被模板化 TDK）',
    }),

    // defineField({
    //   name: 'parentArticle',
    //   title: 'Parent Article',
    //   type: 'reference',
    //   to: [{type: 'article'}],
    //   description: '选择父级文章，如果没有则为顶级文章',
    // }),
    defineField({
      name: 'parent', // ← 字段名去掉 Article 语义
      title: 'Parent Node',
      type: 'reference',
      to: [{type: 'routeNode'}], // ← 自引用，构建路径树；其 _ref 即 verifyHierarchy 校验所需的 parentId
      description: '选择父级路径节点，留空即为根路由（/ 或顶级 slug）',
    }),

    // 替换为内部图片字段
    sanityImageField('sanityImage', 'Image', true),
    defineField({
      name: 'pagebuilder',
      title: 'Page Builder',
      type: 'array',
      description:
        '页面主体内容。articleList 为数据驱动占位 Block，freeContent 为可多次插入的自由富文本 Block',
      of: [...pagebuilderOf],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      description: '仅当 resolvePageType 判定为 Article 时注入 JSON-LD 的 datePublished',
    }),

    // defineField({
    //   name: 'relativeCollections',
    //   title: 'Related Collections',
    //   type: 'array',
    //   description: '相关的产品集合',
    //   of: [{type: 'reference', to: [{type: 'collection'}]}],
    // }),
    // ↑ 整体删除：不再设立独立 Collection Schema，分类关系完全由 URL 父子层级（parent 字段递归）表达，
    //   避免"引用挂载"与"路径归属"两套分类系统并存导致的数据冲突。

    // defineField({name: 'body', title: 'Body', type: 'portableText'}),
    // ↑ 删除：富文本内容已收口至 pagebuilder 中的 freeContent block，
    //   支持"段落→产品→段落"混排，避免游离于 pagebuilder 之外的第二个内容来源。

    defineField({name: 'seo', title: 'SEO', type: 'seo'}),
  ],
  preview: {
    select: {seoImage: 'seo.image', title: 'title'},
    prepare({seoImage, title}) {
      return {media: seoImage, title}
    },
  },
})