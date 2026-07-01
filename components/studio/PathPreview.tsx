// components/studio/PathPreview.tsx
import React, { useEffect, useState } from 'react'
import { useFormValue, useClient } from 'sanity'
import { Card, Text, Stack, Code } from '@sanity/ui'

export function PathPreview() {
  const client = useClient({ apiVersion: '2023-03-15' })
  
  // 1. 实时监听当前文章的 slug 和 父级文章引用 ID
  const currentSlug = useFormValue(['slug', 'current']) as string || ''
  const parentRef = useFormValue(['parentArticle', '_ref']) as string || ''
  
  const [parentPath, setParentPath] = useState('')

  // 2. 当父级改变时，在后台自动去查它的真实 slug 链条
  useEffect(() => {
    if (!parentRef) {
      setParentPath('')
      return
    }

    // 清除草稿前缀，确保能查到数据
    const cleanId = parentRef.replace('drafts.', '')

    // 递归向上查 3 层父级的 slug
    const query = `*[_id == $cleanId || _id == "drafts." + $cleanId][0]{
      "slug": slug.current,
      "parent": parentArticle->{
        "slug": slug.current,
        "parent": parentArticle->{
          "slug": slug.current
        }
      }
    }`

    client.fetch(query, { cleanId }).then((res) => {
      if (res) {
        const segments: string[] = []
        let current = res
        while (current) {
          if (current.slug) segments.unshift(current.slug) // 逆序推入
          current = current.parent
        }
        setParentPath(segments.join('/'))
      }
    }).catch(err => console.error('获取父级路径失败:', err))
  }, [parentRef, client])

  // 3. 拼接最终前台完整路径
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