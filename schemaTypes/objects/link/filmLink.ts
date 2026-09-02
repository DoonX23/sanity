// schemaTypes/objects/link/filmLink.ts
// Film 项目（project-b）统一"单一链接"字段：编辑通过 radio 在 internal/external 间二选一。
// 参照项目里 linkProductType 已有的"父字段决定子字段显隐"写法（hidden: ({parent}) => ...）。

import {defineField} from 'sanity'

export const filmLinkType = defineField({
  title: 'Link',
  name: 'filmLink',
  type: 'object',
  fields: [
    defineField({
      name: 'linkType',
      title: 'Link Type',
      type: 'string',
      // 注意：不要设置 initialValue（见下方 validation 注释，两者需配合才能让 filmLink
      // 在被作为"整体可选"字段使用时（如 navLinkGroup.link）真正做到可留空）。
      options: {
        layout: 'radio',
        list: [
          {title: 'Internal', value: 'internal'},
          {title: 'External', value: 'external'},
        ],
      },
      // 注意：这里不能直接用 Rule.required()！
      // Sanity 对嵌套字段的校验是按 schema 结构整体遍历的，不管祖先对象在文档里是否
      // 真实存在——哪怕外层 filmLink 字段（如 navLinkGroup.link）整个从未被编辑者
      // 触碰过（文档里完全没有这个 key），Sanity 依然会按路径取到 undefined 并对
      // linkType 执行 Rule.required() 校验，直接报错，导致"可选"形同虚设。
      // 改用 Rule.custom：只有当 internal/external/newWindow 中已经有数据
      // （说明编辑者已经开始填写这个链接）却仍未选择 linkType 时才报错；
      // 若整个对象完全空白（未被触碰），则视为"编辑者选择不填",不报错。
      // 对于 filmLink 被用在必填场景（如 navItem.link、navLinkItem.link、
      // navPromoCard.link）的情况，这些字段本身在外层已有 Rule.required()，
      // 会强制要求 link 对象必须有值；而由于 internal/external/newWindow 三个
      // 子字段都依赖 parent.linkType 才会显示（hidden），编辑者唯一能"触碰"到
      // 这个对象、让它在文档中产生数据的方式就是先选择 linkType 单选框，
      // 因此必填场景下依然会被自然地强制要求选择 Internal/External。
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          const parent = context.parent as
            | {internal?: unknown; external?: unknown; newWindow?: unknown}
            | undefined
          const hasOtherData = Boolean(parent?.internal || parent?.external || parent?.newWindow)
          if (!value && hasOtherData) {
            return 'Required'
          }
          return true
        }),
    }),

    defineField({
      name: 'internal',
      title: 'Route Node',
      type: 'reference',
      weak: true,
      to: [{type: 'routeNode'}],
      hidden: ({parent}) => parent?.linkType !== 'internal',
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          if (context.parent?.linkType === 'internal' && !value) {
            return 'Required'
          }
          return true
        }),
    }),
    defineField({
      name: 'external',
      title: 'URL',
      type: 'url',
      hidden: ({parent}) => parent?.linkType !== 'external',
      validation: (Rule) =>
        Rule.uri({scheme: ['http', 'https']}).custom((value, context: any) => {
          if (context.parent?.linkType === 'external' && !value) {
            return 'Required'
          }
          return true
        }),
    }),
    defineField({
      name: 'newWindow',
      title: 'Open in a new window?',
      type: 'boolean',
      // 注意：不要设置 initialValue！原因与上方 linkType 的注释完全一致——
      // Sanity 会在文档/数组项创建时递归地把 initialValue 写入嵌套对象的每个子字段，
      // 哪怕这个子字段当前被 hidden、哪怕整个 filmLink 对象本应是"未被触碰=不存在"的可选字段。
      // 之前设置 initialValue: true 时，navLinkGroup.link 即便编辑者完全没有点开过，
      // 文档里也会自动出现 { newWindow: true }，导致上面 linkType 的 hasOtherData 判断
      // 误以为"编辑者已经开始填写链接"，从而错误地要求必须选择 Link Type，
      // 使得整个 link 字段的"可选"再次名不副实。
      // 去掉 initialValue 后，前端渲染时若 newWindow 为 undefined，按 external 链接的
      // 默认行为处理为 true（新窗口打开）即可，不需要依赖 Studio 端的默认值。
      hidden: ({parent}) => parent?.linkType !== 'external',
    }),

  ],
  preview: {
    select: {linkType: 'linkType', internalTitle: 'internal.title', external: 'external'},
    prepare({linkType, internalTitle, external}) {
      return {
        title: linkType === 'internal' ? internalTitle || 'Untitled route node' : external || 'Untitled URL',
        subtitle: linkType === 'internal' ? 'Internal' : 'External',
      }
    },
  },
})
