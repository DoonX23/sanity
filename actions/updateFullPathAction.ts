// actions/updateFullPathAction.ts
import {useEffect, useState} from 'react'
import {useClient, useDocumentOperation} from 'sanity'

// 修改1: props 加上 :any
export function UpdateFullPathAction(props: any) {
  const {id, type, draft, published} = props
  const [isUpdating, setIsUpdating] = useState(false)
  const doc = draft || published
  const {patch} = useDocumentOperation(id, type)
  const client = useClient({apiVersion: '2023-03-15'})

  if (type !== 'article') {
    return null
  }

  const generatePathAndBreadcrumb = async () => {
    // 检查 doc 是否存在
    if (!doc || !doc.slug?.current) return { fullPath: '', breadcrumb: [] }

    if (!doc.parentArticle || !doc.parentArticle._ref) {
      const path = doc.slug.current
      return {
        fullPath: path,
        breadcrumb: [
          {
            _key: path,
            title: doc.title,
            path: path,
          },
        ],
      }
    }

    const parentDoc: any = await client.getDocument(doc.parentArticle._ref)
    if (parentDoc) {
      const fullPath = `${parentDoc.fullPath}/${doc.slug.current}`
      
      // 修改2: breadcrumb 显式声明为 any 数组
      let breadcrumb: any[] = []

      if (parentDoc.breadcrumb && Array.isArray(parentDoc.breadcrumb)) {
        breadcrumb = [...parentDoc.breadcrumb]
      } else if (parentDoc.title && parentDoc.fullPath) {
        breadcrumb = [{
          _key: parentDoc.fullPath,
          title: parentDoc.title,
          path: parentDoc.fullPath,
        }]
      }

      breadcrumb.push({
        _key: fullPath,
        title: doc.title,
        path: fullPath,
      })

      return {
        fullPath,
        breadcrumb,
      }
    }

    const defaultPath = doc.slug.current
    return {
      fullPath: defaultPath,
      breadcrumb: [
        {
          _key: defaultPath,
          title: doc.title,
          path: defaultPath,
        },
      ],
    }
  }

  // 修改3: parentId 加上 :string类型
  const updateChildDocs = async (parentId: string) => {
    const childDocs = await client.fetch(
      `*[_type == "article" && parentArticle._ref == $parentId]`,
      {parentId}
    )

    for (const childDoc of childDocs) {
      // 获取父文档
      const updatedParent: any = await client.getDocument(parentId)

      // 修改4: 加上空值检查
      if (!updatedParent) continue;

      const childFullPath = `${updatedParent.fullPath}/${childDoc.slug?.current || ''}`
      const childBreadcrumb = [
        ...(updatedParent.breadcrumb || []),
        {
          _key: childFullPath,
          title: childDoc.title,
          path: childFullPath,
        }
      ]

      await client
        .patch(childDoc._id)
        .set({
          fullPath: childFullPath,
          breadcrumb: childBreadcrumb,
        })
        .commit()

      await updateChildDocs(childDoc._id)
    }
  }

  const handleSaveAndUpdatePaths = async () => {
    setIsUpdating(true)

    try {
      const {fullPath, breadcrumb} = await generatePathAndBreadcrumb()

      patch.execute([{
        set: {
          fullPath: fullPath,
          breadcrumb: breadcrumb,
        }
      }])

      setTimeout(async () => {
        await updateChildDocs(id)
        setIsUpdating(false)
      }, 1000)

    } catch (err) {
      console.error('更新路径和面包屑失败:', err)
      setIsUpdating(false)
    }
  }

  useEffect(() => {
    if (doc && doc.slug && doc.slug.current && doc.title && !isUpdating) {
      handleSaveAndUpdatePaths()
    }
  }, [doc?.slug?.current, doc?.parentArticle?._ref, doc?.title])

  return {
    label: isUpdating ? '正在更新路径结构...' : '更新路径结构',
    onHandle: handleSaveAndUpdatePaths,
    disabled: isUpdating
  }
}