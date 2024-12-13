import type { Editor } from '@tiptap/core'
import TiptapStrike, { UnderlineOptions } from '@tiptap/extension-underline'

const Underline = TiptapStrike.extend<UnderlineOptions & { disabled: boolean }>({
  addOptions() {
    return {
      ...this.parent?.(),
      button({ editor, t }: { editor: Editor; t: (...args: any[]) => string }) {
        return {
          props: {
            command: () => {
              editor.chain().focus().toggleUnderline().run()
            },
            isActive: editor.isActive('underline'),
            icon: 'UnderlineIcon',
            name: t('extensions.underline'),
            shortcutKeys: 'Ctrl+U'
          }
        }
      }
    }
  }
})

export default Underline
