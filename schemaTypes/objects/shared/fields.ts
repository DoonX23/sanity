// schemaTypes/objects/shared/fields.ts

import {defineField} from 'sanity'

// 工厂函数：生成通用的 image 对象字段
// 调用时传入 name，可选传入是否包含 altText
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

// 工厂函数：生成通用的 list 数组字段
// 每个 list item 包含 text（文本）和 highlighted（是否高亮）
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