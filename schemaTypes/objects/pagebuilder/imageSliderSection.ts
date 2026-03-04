// schemaTypes/objects/pagebuilder/imageSliderSection.ts

import {defineField, defineType} from 'sanity'
import {listField} from '../shared/fields'

export const imageSliderSection = defineType({
  name: 'imageSliderSection',
  title: 'Image Slider Section',
  type: 'object',
  fields: [
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'subheading', title: 'Subheading', type: 'string'}),
    defineField({
      name: 'items',
      title: 'Slider Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'object',
              fields: [
                defineField({name: 'url', title: 'URL', type: 'url'}),
                defineField({name: 'altText', title: 'Alt Text', type: 'string'}),
              ],
            }),
            defineField({name: 'title', title: 'Title', type: 'string'}),
            defineField({name: 'description', title: 'Description', type: 'text'}),
            listField('list'),
            defineField({name: 'link', title: 'Link', type: 'string'}),
          ],
        },
      ],
    }),
  ],
})