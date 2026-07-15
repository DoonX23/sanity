// schemaTypes/documents/manualProduct.tsx

import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'
import {sanityImageField} from '../objects/shared/fields'

export const manualProductType = defineType({
  name: 'manualProduct',
  title: 'Manual Product',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
      description: '当前售价',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      description: '货币代码 (ISO 4217)，如 USD、CNY',
      initialValue: 'USD',
      options: {
        layout: 'dropdown',
        list: ['USD', 'CNY', 'EUR', 'GBP', 'JPY'],
      },
      validation: (Rule) => Rule.required(),
    }),
    sanityImageField('image', 'Image', true),
  ],
  preview: {
    select: {title: 'title', price: 'price', currency: 'currency', image: 'image'},
    prepare({title, price, currency, image}) {
      const subtitle = [price, currency].filter(Boolean).join(' ')
      return {
        title,
        subtitle: subtitle || undefined,
        media: image,
      }
    },
  },
})