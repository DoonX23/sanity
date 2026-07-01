// actions/copyPagebuilderAction.tsx
// 自定义 Document Action：把另一个 page/article 文档的 pagebuilder 内容
// 复制（覆盖或追加）到当前文档，避免在 Studio 里手动逐个字段填写。

import React, {useState, useCallback} from 'react'
import {CopyIcon} from '@sanity/icons'
import {
  Box,
  Button,
  Card,
  Flex,
  Radio,
  Stack,
  Text,
  TextInput,
  useToast,
} from '@sanity/ui'
import {useClient, useDocumentOperation} from 'sanity'

const SANITY_API_VERSION = '2023-03-15'

// 支持复制 pagebuilder 的文档类型
const SOURCE_TYPES = ['page', 'article']

type SourceDoc = {
  _id: string
  _type: string
  title?: string
  slug?: {current?: string}
  fullPath?: string
  pagebuilder?: any[]
}

// 生成 Sanity 风格的随机 _key（12位字母数字）
function generateKey(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < 12; i++) {
    result += chars[Math.floor(Math.random() * chars.length)]
  }
  return result
}

// 递归遍历数组/对象，把所有出现的 _key 字段替换成新的随机 key
// 避免把源文档的 pagebuilder 数组复制到目标文档时出现 _key 冲突
function regenerateKeys(value: any): any {
  if (Array.isArray(value)) {
    return value.map((item) => regenerateKeys(item))
  }
  if (value && typeof value === 'object') {
    const result: any = {}
    for (const key of Object.keys(value)) {
      result[key] = regenerateKeys(value[key])
    }
    if (typeof result._key === 'string') {
      result._key = generateKey()
    }
    return result
  }
  return value
}

export function CopyPagebuilderAction(props: any) {
  const {id, type, draft, published} = props
  const doc = draft || published

  const [dialogOpen, setDialogOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SourceDoc[]>([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState<SourceDoc | null>(null)
  const [mode, setMode] = useState<'overwrite' | 'append'>('overwrite')
  const [applying, setApplying] = useState(false)

  const {patch} = useDocumentOperation(id, type)
  const client = useClient({apiVersion: SANITY_API_VERSION})
  const toast = useToast()

  if (!SOURCE_TYPES.includes(type)) {
    return null
  }

  const runSearch = useCallback(
    async (q: string) => {
      setQuery(q)
      if (!q || q.trim().length === 0) {
        setResults([])
        return
      }
      setSearching(true)
      try {
        const docs: SourceDoc[] = await client.fetch(
          `*[_type in $types && title match $q && _id != $currentId && !(_id in path("drafts.**"))][0...20]{
            _id, _type, title, slug, fullPath, pagebuilder
          }`,
          {types: SOURCE_TYPES, q: `${q}*`, currentId: id.replace('drafts.', '')}
        )
        setResults(docs || [])
      } catch (err) {
        console.error('搜索源文档失败:', err)
      } finally {
        setSearching(false)
      }
    },
    [client, id]
  )

  const handleApply = useCallback(async () => {
    if (!selected) return
    setApplying(true)
    try {
      // 拿到完整 Published 状态的源文档
      const sourceDoc: any = await client.getDocument(selected._id)

      const sourcePagebuilder = sourceDoc?.pagebuilder || []
      const newBlocks = regenerateKeys(sourcePagebuilder)

      if (mode === 'overwrite') {
        patch.execute([{set: {pagebuilder: newBlocks}}])
      } else {
        const existing = doc?.pagebuilder || []
        patch.execute([{set: {pagebuilder: [...existing, ...newBlocks]}}])
      }

      toast.push({
        status: 'success',
        title: `已${mode === 'overwrite' ? '覆盖' : '追加'} Page Builder 内容，请检查后点击 Publish 发布`,
      })
      setDialogOpen(false)
      setSelected(null)
      setQuery('')
      setResults([])
    } catch (err) {
      console.error('复制 Page Builder 失败:', err)
      toast.push({
        status: 'error',
        title: '复制失败，请重试',
      })
    } finally {
      setApplying(false)
    }
  }, [selected, mode, doc, patch, client, toast])

  return {
    icon: CopyIcon,
    label: '复制 Page Builder',
    onHandle: () => setDialogOpen(true),
    dialog: dialogOpen ? {
      type: 'dialog' as const,
      header: '从其它页面复制 Page Builder 内容',
      onClose: () => setDialogOpen(false),
      content: (
        <Box padding={4}>
          <Stack space={4}>
            <Stack space={2}>
              <Text size={1} weight="semibold">
                搜索源页面（按标题）
              </Text>
              <TextInput
                placeholder="输入标题关键字..."
                value={query}
                onChange={(e) => runSearch(e.currentTarget.value)}
              />
            </Stack>

            <Stack space={2}>
              {searching && <Text size={1} muted>搜索中...</Text>}
              {!searching && query && results.length === 0 && (
                <Text size={1} muted>没有找到匹配的页面</Text>
              )}
              {results.map((r) => {
                const isSelected = selected?._id === r._id
                const blockCount = r.pagebuilder?.length || 0
                return (
                  <Card
                    key={r._id}
                    padding={3}
                    radius={2}
                    tone={isSelected ? 'primary' : undefined}
                    shadow={1}
                    onClick={() => setSelected(r)}
                    style={{cursor: 'pointer'}}
                  >
                    <Flex align="center" justify="space-between">
                      <Stack space={1}>
                        <Text weight="medium">{r.title || '(无标题)'}</Text>
                        <Text size={1} muted>
                          {r._type} · {r.fullPath || r.slug?.current || '(无路径)'} ·{' '}
                          {blockCount} 个内容块
                        </Text>
                      </Stack>
                      {isSelected && <Text size={1}>已选中</Text>}
                    </Flex>
                  </Card>
                )
              })}
            </Stack>

            {selected && (
              <Stack space={3} paddingTop={2}>
                <Text size={1} weight="semibold">
                  复制方式
                </Text>
                <Flex direction="column" gap={2}>
                  <Flex align="center" gap={2}>
                    <Radio
                      checked={mode === 'overwrite'}
                      onChange={() => setMode('overwrite')}
                      name="copy-mode"
                    />
                    <Text size={1} onClick={() => setMode('overwrite')} style={{cursor: 'pointer'}}>
                      覆盖当前 Page Builder（清空后替换）
                    </Text>
                  </Flex>
                  <Flex align="center" gap={2}>
                    <Radio
                      checked={mode === 'append'}
                      onChange={() => setMode('append')}
                      name="copy-mode"
                    />
                    <Text size={1} onClick={() => setMode('append')} style={{cursor: 'pointer'}}>
                      追加到当前 Page Builder 末尾
                    </Text>
                  </Flex>
                </Flex>

                <Button
                  text={applying ? '正在应用...' : '确认复制'}
                  tone="primary"
                  disabled={applying}
                  onClick={handleApply}
                />
              </Stack>
            )}
          </Stack>
        </Box>
      ),
    } : false,
  }
}
