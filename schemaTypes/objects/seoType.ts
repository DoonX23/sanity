import { defineField, defineType } from 'sanity'

export const seoType = defineType({
  name: 'seo',
  title: 'SEO & Metadata',
  type: 'object',
  options: {
    collapsible: true,
    collapsed: false,
  },
  fieldsets: [
    { name: 'basic', title: 'Basic SEO', options: { collapsible: true, collapsed: false } },
    { name: 'social', title: 'Social Media (Open Graph & Twitter)', options: { collapsible: true, collapsed: true } },
    { name: 'advanced', title: 'Advanced & Robots', options: { collapsible: true, collapsed: true } },
  ],
  fields: [
    // --- 基础 SEO ---
    defineField({
      name: 'title',
      title: 'Meta Title',
      type: 'string',
      fieldset: 'basic',
      validation: (Rule) =>
        Rule.max(60).warning('Longer titles may be truncated by search engines (max 60 chars)'),
    }),
    defineField({
      name: 'description',
      title: 'Meta Description',
      type: 'text',
      rows: 3,
      fieldset: 'basic',
      validation: (Rule) =>
        Rule.max(160).warning('Longer descriptions may be truncated by search engines (max 160 chars)'),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords',
      description: 'Press Enter to add keywords. Useful for some regional search engines.',
      type: 'array',
      of: [{ type: 'string' }],
      fieldset: 'basic',
      options: {
        layout: 'tags',
      },
    }),

    // --- 社交媒体 (Open Graph) ---
    defineField({
      name: 'ogTitle',
      title: 'Social Share Title',
      description: 'Fallback to Meta Title if empty.',
      type: 'string',
      fieldset: 'social',
    }),
    defineField({
      name: 'ogDescription',
      title: 'Social Share Description',
      description: 'Fallback to Meta Description if empty.',
      type: 'text',
      rows: 2,
      fieldset: 'social',
    }),
    defineField({
      name: 'ogImage',
      title: 'Social Share Image',
      description: 'Recommended size: 1200x630 pixels. Fallback to default site image if empty.',
      type: 'image',
      fieldset: 'social',
    }),

    // --- 高级控制 (Advanced) ---
    defineField({
      name: 'canonical',
      title: 'Canonical URL',
      description: 'Custom canonical URL if different from the normal page URL.',
      type: 'url',
      fieldset: 'advanced',
    }),
    defineField({
      name: 'noIndex',
      title: 'No Index',
      description: 'Hide this page from search engines.',
      type: 'boolean',
      initialValue: false,
      fieldset: 'advanced',
    }),
    defineField({
      name: 'noFollow',
      title: 'No Follow',
      description: 'Tell search engines not to follow links on this page.',
      type: 'boolean',
      initialValue: false,
      fieldset: 'advanced',
    }),
    defineField({
      name: 'excludeFromSitemap',
      title: 'Exclude from Sitemap',
      description: 'Do not include this page in the sitemap.xml',
      type: 'boolean',
      initialValue: false,
      fieldset: 'advanced',
    }),
    defineField({
      name: 'structuredData',
      title: 'Structured Data (JSON-LD)',
      description: 'Paste custom JSON-LD script for rich snippets (Schema.org).',
      type: 'text',
      rows: 5,
      fieldset: 'advanced',
      validation: (Rule) =>
        Rule.custom((value) => {
          if (!value) return true
          try {
            JSON.parse(value)
            return true
          } catch (err) {
            return 'Must be valid JSON format'
          }
        }),
    }),
  ],
})