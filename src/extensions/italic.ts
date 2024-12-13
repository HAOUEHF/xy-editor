import type { Editor } from '@tiptap/core'
import TiptapItalic, { ItalicOptions } from '@tiptap/extension-italic'

const Italic = TiptapItalic.extend<ItalicOptions & { disabled: boolean }>({
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          props: {
            command: () => {
              editor.chain().focus().toggleItalic().run()
            },
            isActive: editor.isActive('italic'),
            icon: 'ItalicIcon',
            name: t('extensions.italic'),
            shortcutKeys: 'Ctrl+I'
          }
        }
      }
    }
  }
})

export default Italic
