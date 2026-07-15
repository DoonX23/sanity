// schemaTypes/objects/pagebuilder/index.ts

import {splitSection} from './splitSection'
import {imageSliderSection} from './imageSliderSection'
import {heroSection} from './heroSection'
import {statsSection} from './statsSection'
import {cardGridSection} from './cardGridSection'
import {heroSplitBlock} from './heroSplitBlock'
import {productBlock} from './productBlock'
import {productListBlock} from './productListBlock'
import {articleListBlock} from './articleListBlock'
import {freeContent} from './freeContent'

// 导出所有 Section 类型，供 schemaTypes/index.ts 注册
export const pagebuilderTypes = [
  splitSection,
  imageSliderSection,
  heroSection,
  statsSection,
  cardGridSection,
  heroSplitBlock,
  productBlock,
  productListBlock,
  articleListBlock,
  freeContent,
]

// 导出 pagebuilder 字段的 of 数组，供 article 和 page 复用
export const 
pagebuilderOf = [
  {type: 'heroSplitBlock'},
  {type: 'splitSection'},
  {type: 'imageSliderSection'},
  {type: 'heroSection'},
  {type: 'statsSection'},
  {type: 'cardGridSection'},
  {type: 'productBlock'},
  {type: 'productListBlock'},
  {type: 'articleListBlock'},
  {type: 'freeContent'},
] as const
