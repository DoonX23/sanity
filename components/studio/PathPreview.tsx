// components/studio/PathPreview.tsx

import React, { useEffect, useState } from 'react'
import { useFormValue, useClient } from 'sanity'
import { Card, Text, Stack, Code } from '@sanity/ui'

export function PathPreview() {
  const client = useClient({ apiVersion: '2023-03-15' })

  const currentSlug = (useFormValue(['slug', 'current']) as string) || ''

  // ↓ 关键修复①：不再硬编码单一字段名，兼容新旧两个项目的父级字段
  // 旧项目 article 用 'parentArticle'，新项目 routeNode 用 'parent'
  const parentRefLegacy = useFormValue(['parentArticle', '_ref']) as string | undefined
  const parentRefNew = useFormValue(['parent', '_ref']) as string | undefined
  const parentRef = parentRefNew || parentRefLegacy || ''

  // ↓ 关键修复②：同步取出当前文档类型，查询时按类型自适应父级字段名
  const docType = useFormValue(['_type']) as string

  const [parentPath, setParentPath] = useState('')

  useEffect(() => {
    if (!parentRef) {
      setParentPath('')
      return
    }

    // ↓ 关键修复③：用 JS 迭代替代 GROQ 硬编码 3 层嵌套，支持任意深度路径
    async function resolveChain(refId: string) {
      const segments: string[] = []
      let currentId: string | undefined = refId.replace('drafts.', '')

      // 防御性上限，避免脚本因脏数据（环形引用）死循环
      let guard = 0

      while (currentId && guard < 20) {
        guard++

        // ↓ coalesce 同时兼容两种父级字段名，一条查询覆盖两个项目
        const query = `*[_id == $id || _id == "drafts." + $id][0]{
          "slug": slug.current,
          "parentId": coalesce(parent._ref, parentArticle._ref)
        }`

        const res = await client.fetch(query, { id: currentId })
        if (!res) break

        if (res.slug) segments.unshift(res.slug)
        currentId = res.parentId
      }

      return segments.join('/')
    }

    resolveChain(parentRef)
      .then(setParentPath)
      .catch((err) => console.error('获取父级路径失败:', err))
  }, [parentRef, client, docType])

  const fullPath = [parentPath, currentSlug].filter(Boolean).join('/')

  return (
    <Card padding={3} tone="transparent" border style={{ borderRadius: 6 }}>
      <Stack space={2}>
        <Text size={1} weight="bold" muted>
          🔗 前端访问路径预览:
        </Text>
        <Code language="bash" size={2}>
          /{fullPath}
        </Code>
      </Stack>
    </Card>
  )
}