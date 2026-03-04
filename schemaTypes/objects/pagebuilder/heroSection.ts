// schemaTypes/objects/pagebuilder/heroSection.ts

import {defineField, defineType} from 'sanity'
import {listField} from '../shared/fields'

export const heroSection = defineType({
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  fields: [
    defineField({name: 'tagline', title: 'Tagline', type: 'string'}),
    defineField({name: 'taglineLink', title: 'Tagline Link', type: 'string'}),
    defineField({name: 'taglineLinkText', title: 'Tagline Link Text', type: 'string'}),
    defineField({name: 'heading', title: 'Heading', type: 'string'}),
    defineField({name: 'description', title: 'Description', type: 'text'}),
    listField('list'),
  ],
})