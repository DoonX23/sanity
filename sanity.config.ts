import {
  defineConfig,
  isDev,
  DocumentActionComponent,
  DocumentActionsContext,
  AssetSource,
} from 'sanity'

import {structureTool} from 'sanity/structure'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

import {visionTool} from '@sanity/vision'
import {colorInput} from '@sanity/color-input'
import {imageHotspotArrayPlugin} from 'sanity-plugin-hotspot-array'
import {media, mediaAssetSource} from 'sanity-plugin-media'
import {customDocumentActions} from './plugins/customDocumentActions'
import Navbar from './components/studio/Navbar'

import {UpdateFullPathAction} from './actions/updateFullPathAction' // 注释掉
import {CopyPagebuilderAction} from './actions/copyPagebuilderAction'

const devOnlyPlugins = [visionTool()]

// 1. 将所有共通的配置提取到一个对象中，并解决 TypeScript 类型报错
const sharedConfig = {
  plugins: [
    structureTool({structure}),
    colorInput(),
    imageHotspotArrayPlugin(),
    customDocumentActions(),
    media(),
    ...(isDev ? devOnlyPlugins : []),
  ],
  document: { // 注释掉整个 document 配置
    actions: (prev: DocumentActionComponent[], context: DocumentActionsContext) => {
      if (context.schemaType === 'article') {
        return [UpdateFullPathAction, CopyPagebuilderAction as DocumentActionComponent, ...prev]
      }
      if (context.schemaType === 'page') {
        return [CopyPagebuilderAction as DocumentActionComponent, ...prev]
      }
      return prev
    },
  },
  schema: {
    types: schemaTypes,
  },

  form: {
    file: {
      assetSources: (previousAssetSources: AssetSource[]) => {
        return previousAssetSources.filter(
          (assetSource: AssetSource) => assetSource !== mediaAssetSource
        )
      },
    },
    image: {
      assetSources: (previousAssetSources: AssetSource[]) => {
        return previousAssetSources.filter(
          (assetSource: AssetSource) => assetSource === mediaAssetSource
        )
      },
    },
  },

  studio: {
    components: {
      navbar: Navbar,
    },
  },
}

// 2. 导出一个数组，定义两个工作区（Workspaces）
export default defineConfig([
  {
    name: 'project-a',
    title: 'DoonX Shopify (项目A)',
    projectId: 'nmemjmqq',               // 这是你原来的项目 A 的 ID
    dataset: 'production',
    basePath: '/project-a',             // 给 A 分配专属访问路径
    ...sharedConfig,
  },
  {
    name: 'project-b',
    title: 'Film (项目B)',
    projectId: 'gk58krfu',          // 👈 请在这里填入项目 B 的真实 ID
    dataset: 'production',
    basePath: '/project-b',             // 给 B 分配专属访问路径，必须与 A 不同
    ...sharedConfig,
  },
])