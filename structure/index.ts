import {ListItemBuilder, StructureResolver} from 'sanity/structure';
import collections from './collectionStructure'
import colorThemes from './colorThemeStructure'
import home from './homeStructure'
import pages from './pageStructure'
import products from './productStructure'
import settings from './settingStructure'
import navbar from './navbarStructure'

// 1. 在这里把 'article' 加进去，过滤掉它，防止它在底部再次出现
const hiddenDocTypes = (listItem: ListItemBuilder) => {
  const id = listItem.getId()

  if (!id) {
    return false
  }

  return ![
    'routeNode', // 👈 新增这一行
    'article', // 👈 新增这一行
    'collection',
    'colorTheme',
    'home',
    'media.tag',
    'page',
    'product',
    'productVariant',
    'settings',
    'navbarSettings', // Film 项目专属导航单例
  ].includes(id)
}

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('Content')
    .items([
      home(S, context),
      pages(S, context),
      
      // 2. 👈 将 article 放在你指定的任何位置，比如放在 pages 下面
      S.documentTypeListItem('article').title('Article'),
      S.documentTypeListItem('routeNode').title('Route Node'),
      S.divider(),
      collections(S, context),
      products(S, context),
      S.divider(),
      colorThemes(S, context),
      S.divider(),
      settings(S, context),
      navbar(S, context),
      S.divider(),
      
      // 没被 hiddenDocTypes 过滤掉的其他文档会默认显示在这里（也就是之前的 article 所在的位置）
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ])
