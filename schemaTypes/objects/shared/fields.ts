// schemaTypes/objects/shared/fields.ts

import {defineField} from 'sanity'

// ---------- 旧字段：Shopify 图片链接，A（Hydrogen）项目依赖，禁止修改结构 ----------
export function imageField(name: string, includeAltText = false) {
  return defineField({
    name,
    title: 'Image',
    type: 'object',
    fields: [
      defineField({name: 'url', title: 'URL', type: 'url'}),
      ...(includeAltText
        ? [defineField({name: 'altText', title: 'Alt Text', type: 'string'})]
        : []),
      defineField({name: 'height', title: 'Height', type: 'number'}),
      defineField({name: 'width', title: 'Width', type: 'number'}),
    ],
  })
}

// ---------- 新字段：Sanity 原生图片资源，仅供 B 项目纯 Sanity 驱动的组件使用 ----------
// 调用时字段名统一带 sanity 前缀（如 sanityImage），与旧字段区分数据来源
export function sanityImageField(name: string, title: string, isRequired = false) {
  return defineField({
    name,
    title,
    type: 'image',
    options: {hotspot: true},
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt Text',
        type: 'string',
        description: '图片替代文本，直接影响图片 SEO 与无障碍访问，必填',
        validation: (rule) => rule.required(),
      }),
    ],
    validation: isRequired ? (rule) => rule.required() : undefined,
  })
}

// ---------- list 字段，无关，保留 ----------
export function listField(name: string) {
  return defineField({
    name,
    title: 'List Items',
    type: 'array',
    of: [
      {
        type: 'object',
        fields: [
          defineField({name: 'text', title: 'Text', type: 'string'}),
          defineField({
            name: 'highlighted',
            title: 'Highlight',
            type: 'boolean',
            initialValue: false,
          }),
        ],
      },
    ],
  })
}