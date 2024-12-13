import { Editor, Extension } from '@tiptap/core'
import TiptapHeading from '@tiptap/extension-heading'
import type { HeadingOptions } from '@tiptap/extension-heading'

const Heading = TiptapHeading.extend<HeadingOptions & { disabled: boolean }>({
  addOptions() {
    
    return {
      ...this.parent?.(),
      button({ editor, extension, t }: { editor: Editor; extension: Extension; t: (...args: any[]) => string }) {
        return {
          props: {
            command: (level: any) => {
              if (level === 'Paragraph') {
                editor.chain().focus().clearNodes().run()
                return
              }
              editor.chain().focus().toggleHeading({ level }).run()
            },
            options: [
              {
                label: t('dropHeading.Paragraph'),
                value: 'Paragraph',
                class: 'paragraph-level'
              },
              ...extension.options.levels.map((level: number) => {
                return {
                  label: t(`dropHeading.H${level}`),
                  value: level,
                  class: `h${level}-level`
                }
              })
            ],
            activeValue: editor.getAttributes('heading')?.level || 'Paragraph',
            activeText: t(
              `dropHeading.${editor.getAttributes('heading')?.level ? 'H' + editor.getAttributes('heading')?.level : 'Paragraph'}`
            ),
            name: t('extensions.heading'),
          }
        }
      }
    }
  },
})

export default Heading
