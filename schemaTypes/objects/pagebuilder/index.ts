// schemaTypes/objects/pagebuilder/index.ts

import {splitSection} from './splitSection'
import {imageSliderSection} from './imageSliderSection'
import {heroSection} from './heroSection'
import {statsSection} from './statsSection'
import {cardGridSection} from './cardGridSection'

// 导出所有 Section 类型，供 schemaTypes/index.ts 注册
export const pagebuilderTypes = [
  splitSection,
  imageSliderSection,
  heroSection,
  statsSection,
  cardGridSection,
]

// 导出 pagebuilder 字段的 of 数组，供 article 和 page 复用
export const pagebuilderOf = [
  {type: 'splitSection'},
  {type: 'imageSliderSection'},
  {type: 'heroSection'},
  {type: 'statsSection'},
  {type: 'cardGridSection'},
] as const